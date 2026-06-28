const { GoogleGenAI } = require("@google/genai");
const Groq = require("groq-sdk");
const supabase = require("../supabase");
const pdfParse = require("pdf-parse");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ── AI call: Gemini primary (native PDF vision), Groq fallback ────────────────
async function callAI(prompt, pdfBase64, extractedText) {
  // Primary: Gemini — reads the actual PDF bytes natively
  try {
    console.log("📤 Calling Gemini 2.0 Flash with PDF...");
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        { inlineData: { mimeType: "application/pdf", data: pdfBase64 } },
        { text: prompt },
      ],
    });
    console.log("✅ Gemini succeeded");
    return response.text;
  } catch (geminiErr) {
    console.warn("⚠️  Gemini failed:", geminiErr.message);
    console.log("🔄 Falling back to Groq Llama 3.3 70B (text mode)...");

    // Groq fallback — inject extracted text so it can actually read the resume
    let groqPrompt = prompt;
    if (extractedText && extractedText.trim().length > 80) {
      groqPrompt =
        `${prompt}\n\n=== RESUME TEXT START ===\n${extractedText}\n=== RESUME TEXT END ===`;
      console.log(
        "📄 Injecting extracted PDF text into Groq prompt, length:",
        extractedText.length
      );
    } else {
      console.warn(
        "⚠️  Extracted text too short or empty — Groq will score as blank resume"
      );
      groqPrompt =
        `${prompt}\n\n[RESUME IS BLANK OR UNREADABLE. Score resume_score and ats_score between 5 and 20.]`;
    }

    const groqResponse = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: groqPrompt }],
      temperature: 0.2,
      max_tokens: 1024,
    });

    console.log("✅ Groq fallback succeeded");
    return groqResponse.choices[0].message.content;
  }
}

// ─── Resume Analysis (accepts multipart/form-data with the PDF file) ──────────
exports.analyzeResume = async (req, res) => {
  try {
    // multer puts the file in req.file and text fields in req.body
    const userId = req.body.userId;
    const file = req.file; // { buffer, originalname, mimetype, size }

    console.log("USER:", userId);
    console.log(
      "FILE:",
      file ? `${file.originalname} (${file.size} bytes)` : "MISSING"
    );

    if (!userId) {
      return res.status(400).json({ success: false, message: "userId is required" });
    }
    if (!file || !file.buffer || file.buffer.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Resume file is required" });
    }

    // ── Save file to Supabase Storage so "View Resume" still works ────────────
    const extension = file.originalname.split(".").pop() || "pdf";
    const storageFileName = `${userId}.${extension}`;
    const { error: storageError } = await supabase.storage
      .from("resumes")
      .upload(storageFileName, file.buffer, {
        upsert: true,
        contentType: file.mimetype || "application/pdf",
      });
    if (storageError) {
      console.warn("⚠️  Storage upload failed (non-fatal):", storageError.message);
    } else {
      console.log("✅ Resume saved to storage:", storageFileName);
    }

    // Save / update resumes table record
    const { data: publicUrlData } = supabase.storage
      .from("resumes")
      .getPublicUrl(storageFileName);
    const fileUrl = publicUrlData?.publicUrl || "";

    const { data: existingResume } = await supabase
      .from("resumes")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (existingResume) {
      await supabase
        .from("resumes")
        .update({ file_name: file.originalname, file_url: fileUrl })
        .eq("user_id", userId);
    } else {
      await supabase.from("resumes").insert({
        user_id: userId,
        file_name: file.originalname,
        file_url: fileUrl,
      });
    }

    // ── Fetch profile to tailor analysis ─────────────────────────────────────
    let profile = null;
    try {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();
      profile = profileData;
      console.log(
        "Profile loaded — target role:",
        profile?.target_role || "Software Developer"
      );
    } catch (profileErr) {
      console.warn("⚠️  Profile fetch failed:", profileErr.message);
    }

    const targetRole = profile?.target_role || "Software Developer";
    const experienceLevel = profile?.degree || "Intermediate";

    const pdfBuffer = file.buffer;
    console.log("PDF size:", pdfBuffer.length, "bytes");

    // ── Extract text for Groq fallback ────────────────────────────────────────
    let extractedText = "";
    try {
      const parsed = await pdfParse(pdfBuffer);
      extractedText = parsed.text.trim();
      console.log("📄 PDF text extracted, length:", extractedText.length, "chars");
      if (extractedText.length < 80) {
        console.warn(
          "⚠️  Very short extracted text — may be image-based or corrupt PDF"
        );
      }
    } catch (parseErr) {
      console.error("❌ pdf-parse failed:", parseErr.message);
    }

    const pdfBase64 = pdfBuffer.toString("base64");

    const prompt = `
You are a senior technical recruiter and professional resume writer.
Analyze this candidate's resume for the role of: "${targetRole}" (${experienceLevel} level).

Strictly evaluate the resume against standard market requirements for "${targetRole}" and the candidate's actual qualifications.

Evaluation Metrics:
1. ATS Compatibility (Format, section headers, readability, keyword match for "${targetRole}").
2. Core Technical Skills (Does the resume list relevant skills for "${targetRole}"? How many are matched vs. missing?)
3. Strengths (At least 2-3 specific, detailed professional highlights from the resume content).
4. Weaknesses (At least 2-3 specific gaps relative to the "${targetRole}" role).
5. Recommendations (Clear, actionable improvements for their resume, project section, or skills).

Special Rules:
- If the resume is empty, contains nonsense, or is extremely short/blank, score both resume_score and ats_score very low (5–30) and list "Missing resume content" or "Invalid format" as a major weakness.
- Generate realistic scores out of 100 based on actual content matching. Do NOT use fixed values like 80 or 85 every time.
- Do NOT use generic template placeholders.
- missing_skill_list must contain actual missing technical skills needed for "${targetRole}" that are NOT present in the resume.
- Return at least 3 skills in missing_skill_list whenever possible.

Return ONLY a valid JSON object matching this exact schema (no markdown, no extra text):
{
  "resume_score": number,
  "ats_score": number,
  "matched_skills": number,
  "missing_skills": number,
  "missing_skill_list": ["skill1", "skill2"],
  "strengths": ["string"],
  "weaknesses": ["string"],
  "recommendations": ["string"]
}
`;

    const aiResponse = await callAI(prompt, pdfBase64, extractedText);
    console.log("RAW AI RESPONSE:", aiResponse?.substring(0, 300));

    // Strip any markdown code fences
    const cleaned = aiResponse
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/gi, "")
      .trim();

    let analysis;
    try {
      analysis = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error("❌ JSON parse failed, raw response:", aiResponse);
      throw new Error("AI returned invalid JSON: " + parseErr.message);
    }

    console.log("PARSED ANALYSIS:", JSON.stringify(analysis, null, 2));

    // Normalise scores
    let resumeScore = parseFloat(analysis.resume_score) || 0;
    let atsScore = parseFloat(analysis.ats_score) || 0;

    if (resumeScore > 0 && resumeScore <= 1) resumeScore = Math.round(resumeScore * 100);
    else resumeScore = Math.round(resumeScore);

    if (atsScore > 0 && atsScore <= 1) atsScore = Math.round(atsScore * 100);
    else atsScore = Math.round(atsScore);

    resumeScore = Math.max(0, Math.min(100, resumeScore));
    atsScore = Math.max(0, Math.min(100, atsScore));

    const matchedSkills = Math.round(parseFloat(analysis.matched_skills)) || 0;
    const missingSkills = Math.round(parseFloat(analysis.missing_skills)) || 0;

    analysis.resume_score = resumeScore;
    analysis.ats_score = atsScore;
    analysis.matched_skills = matchedSkills;
    analysis.missing_skills = missingSkills;

    // Save analysis to DB
    const { error: dbError } = await supabase
      .from("resume_analysis")
      .upsert(
        {
          user_id: userId,
          resume_score: resumeScore,
          ats_score: atsScore,
          matched_skills: matchedSkills,
          missing_skills: missingSkills,
          missing_skill_list: analysis.missing_skill_list || [],
          strengths: analysis.strengths || [],
          weaknesses: analysis.weaknesses || [],
          recommendations: analysis.recommendations || [],
        },
        { onConflict: "user_id" }
      )
      .select();

    if (dbError) {
      console.error("SUPABASE DB ERROR:", dbError);
      throw new Error(`Database error saving analysis: ${dbError.message}`);
    }

    console.log("✅ Analysis saved to DB successfully");
    return res.status(200).json({ success: true, analysis });
  } catch (error) {
    console.error("ANALYSIS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Analysis failed",
    });
  }
};

// ─── Download PDF Report ──────────────────────────────────────────────────────
const PDFDocument = require("pdfkit");

exports.downloadReport = async (req, res) => {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .from("resume_analysis")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error || !data) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }

    const doc = new PDFDocument();
    res.setHeader("Content-Disposition", "attachment; filename=PrepPilot_Report.pdf");
    res.setHeader("Content-Type", "application/pdf");
    doc.pipe(res);

    doc.fontSize(22).text("PrepPilot Resume Report", { align: "center" });
    doc.moveDown();
    doc.fontSize(16).text(`Resume Score: ${data.resume_score}`);
    doc.text(`ATS Score: ${data.ats_score}`);
    doc.text(`Matched Skills: ${data.matched_skills}`);
    doc.text(`Missing Skills: ${data.missing_skills}`);
    doc.moveDown();

    doc.fontSize(18).text("Strengths");
    data.strengths?.forEach((item) => doc.fontSize(12).text(`• ${item}`));
    doc.moveDown();

    doc.fontSize(18).text("Weaknesses");
    data.weaknesses?.forEach((item) => doc.fontSize(12).text(`• ${item}`));
    doc.moveDown();

    doc.fontSize(18).text("Recommended Skills");
    data.missing_skill_list?.forEach((item) => doc.fontSize(12).text(`• ${item}`));
    doc.moveDown();

    doc.fontSize(18).text("AI Recommendations");
    data.recommendations?.forEach((item) => doc.fontSize(12).text(`• ${item}`));

    doc.end();
  } catch (err) {
    console.error("downloadReport error:", err);
    return res.status(500).json({ success: false, message: "Failed to generate PDF" });
  }
};
