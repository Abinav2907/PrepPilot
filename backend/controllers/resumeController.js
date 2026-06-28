const { GoogleGenAI } = require("@google/genai");
const Groq = require("groq-sdk");
const supabase = require("../supabase");
const pdfParse = require("pdf-parse");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ── Build the analysis prompt ─────────────────────────────────────────────────
function buildPrompt(targetRole, experienceLevel) {
  return `
You are a senior technical recruiter and resume expert.
Analyze the resume content provided below for the role of: "${targetRole}" (${experienceLevel} level).

IMPORTANT RULES:
- Read EVERY line of the resume text carefully before scoring.
- Generate scores that accurately reflect the actual content of the resume.
- If the resume has real projects, experience, skills — score accordingly (40-90 range).
- If the resume is completely empty or unreadable — score 5-25.
- DO NOT return fixed values like 10 or 80 every time. Read the content and score accordingly.
- missing_skill_list: list actual technical skills needed for "${targetRole}" that are NOT in the resume.
- Return at least 3 items in missing_skill_list.
- Return ONLY a JSON object — no markdown, no code fences, no extra text.

Return this exact JSON schema:
{
  "resume_score": number,
  "ats_score": number,
  "matched_skills": number,
  "missing_skills": number,
  "missing_skill_list": ["skill1", "skill2", "skill3"],
  "strengths": ["specific strength from resume content"],
  "weaknesses": ["specific weakness relative to role"],
  "recommendations": ["specific actionable improvement"]
}
`;
}

// ── Primary: Groq with extracted text (no daily rate limits) ─────────────────
async function analyzeWithGroq(prompt, extractedText) {
  const hasText = extractedText && extractedText.trim().length > 100;

  let fullPrompt;
  if (hasText) {
    fullPrompt = `${prompt}\n\n=== RESUME CONTENT ===\n${extractedText}\n=== END OF RESUME ===`;
    console.log("📄 Groq: injecting", extractedText.length, "chars of resume text");
  } else {
    fullPrompt = `${prompt}\n\n[NO READABLE TEXT FOUND IN RESUME. Score resume_score=10, ats_score=8, matched_skills=0, missing_skills=10]`;
    console.warn("⚠️  Groq: resume text is empty/too short — scoring as blank");
  }

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: fullPrompt }],
    temperature: 0.1,
    max_tokens: 1500,
  });

  return response.choices[0].message.content;
}

// ── Fallback: Gemini with native PDF bytes ────────────────────────────────────
async function analyzeWithGemini(prompt, pdfBase64) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [
      { inlineData: { mimeType: "application/pdf", data: pdfBase64 } },
      { text: prompt },
    ],
  });
  return response.text;
}

// ─── Resume Analysis ──────────────────────────────────────────────────────────
exports.analyzeResume = async (req, res) => {
  try {
    const userId = req.body.userId;
    const file = req.file; // set by multer

    console.log("=== ANALYSE RESUME ===");
    console.log("USER:", userId);
    console.log("FILE:", file ? `${file.originalname} (${file.size} bytes)` : "MISSING");

    if (!userId) {
      return res.status(400).json({ success: false, message: "userId is required" });
    }
    if (!file || !file.buffer || file.buffer.length === 0) {
      return res.status(400).json({ success: false, message: "Resume file is required" });
    }

    const pdfBuffer = file.buffer;
    console.log("Buffer size:", pdfBuffer.length, "bytes");

    // ── Step 1: Extract text from PDF ────────────────────────────────────────
    let extractedText = "";
    try {
      const parsed = await pdfParse(pdfBuffer);
      extractedText = (parsed.text || "").trim();
      console.log("✅ pdf-parse extracted", extractedText.length, "characters");
      if (extractedText.length > 0) {
        console.log("--- First 300 chars ---");
        console.log(extractedText.substring(0, 300));
        console.log("-----------------------");
      }
    } catch (parseErr) {
      console.error("❌ pdf-parse failed:", parseErr.message);
    }

    // ── Step 2: Save file to Supabase Storage (for View Resume button) ────────
    const extension = (file.originalname.split(".").pop() || "pdf").toLowerCase();
    const storageFileName = `${userId}.${extension}`;
    const { error: storageError } = await supabase.storage
      .from("resumes")
      .upload(storageFileName, pdfBuffer, {
        upsert: true,
        contentType: file.mimetype || "application/pdf",
      });
    if (storageError) {
      console.warn("⚠️  Storage upload failed (non-fatal):", storageError.message);
    } else {
      console.log("✅ File saved to storage:", storageFileName);
    }

    // ── Step 3: Save/update resumes table ────────────────────────────────────
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

    // ── Step 4: Fetch user profile ────────────────────────────────────────────
    let profile = null;
    try {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();
      profile = profileData;
      console.log("Profile → target_role:", profile?.target_role, "| degree:", profile?.degree);
    } catch (profileErr) {
      console.warn("⚠️  Profile fetch failed:", profileErr.message);
    }

    const targetRole = profile?.target_role || "Software Developer";
    const experienceLevel = profile?.degree || "Intermediate";
    const prompt = buildPrompt(targetRole, experienceLevel);

    // ── Step 5: Call AI — Groq primary, Gemini fallback ──────────────────────
    let aiResponse = null;
    let modelUsed = "";

    // Primary: Groq (unlimited, text-based)
    try {
      console.log("📤 Calling Groq (primary)...");
      aiResponse = await analyzeWithGroq(prompt, extractedText);
      modelUsed = "Groq Llama-3.3-70B";
      console.log("✅ Groq succeeded");
    } catch (groqErr) {
      console.error("❌ Groq failed:", groqErr.message);

      // Fallback: Gemini (native PDF, may hit rate limits)
      try {
        console.log("📤 Falling back to Gemini...");
        const pdfBase64 = pdfBuffer.toString("base64");
        aiResponse = await analyzeWithGemini(prompt, pdfBase64);
        modelUsed = "Gemini 2.0 Flash";
        console.log("✅ Gemini fallback succeeded");
      } catch (geminiErr) {
        console.error("❌ Gemini also failed:", geminiErr.message);
        throw new Error(`Both AI models failed. Groq: ${groqErr.message} | Gemini: ${geminiErr.message}`);
      }
    }

    console.log("Model used:", modelUsed);
    console.log("Raw AI response (first 400 chars):", aiResponse?.substring(0, 400));

    // ── Step 6: Parse JSON response ───────────────────────────────────────────
    const cleaned = (aiResponse || "")
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/gi, "")
      .trim();

    let analysis;
    try {
      // Try direct parse first
      analysis = JSON.parse(cleaned);
    } catch (e1) {
      // Try to extract JSON object from surrounding text
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          analysis = JSON.parse(match[0]);
        } catch (e2) {
          console.error("JSON parse failed. Raw response:", aiResponse);
          throw new Error("AI returned invalid JSON");
        }
      } else {
        console.error("No JSON object found. Raw response:", aiResponse);
        throw new Error("AI response contained no JSON object");
      }
    }

    console.log("Parsed analysis:", JSON.stringify(analysis, null, 2));

    // ── Step 7: Normalise scores ──────────────────────────────────────────────
    let resumeScore = parseFloat(analysis.resume_score) || 0;
    let atsScore = parseFloat(analysis.ats_score) || 0;

    // Handle 0–1 float range (e.g. 0.75 → 75)
    if (resumeScore > 0 && resumeScore <= 1) resumeScore = Math.round(resumeScore * 100);
    else resumeScore = Math.round(resumeScore);

    if (atsScore > 0 && atsScore <= 1) atsScore = Math.round(atsScore * 100);
    else atsScore = Math.round(atsScore);

    resumeScore = Math.max(0, Math.min(100, resumeScore));
    atsScore = Math.max(0, Math.min(100, atsScore));

    const matchedSkills = Math.max(0, Math.round(parseFloat(analysis.matched_skills)) || 0);
    const missingSkills = Math.max(0, Math.round(parseFloat(analysis.missing_skills)) || 0);

    analysis.resume_score = resumeScore;
    analysis.ats_score = atsScore;
    analysis.matched_skills = matchedSkills;
    analysis.missing_skills = missingSkills;

    // ── Step 8: Save to DB ────────────────────────────────────────────────────
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
      );

    if (dbError) {
      console.error("DB upsert error:", dbError);
      throw new Error(`Database error: ${dbError.message}`);
    }

    console.log("✅ Analysis saved. Scores →", resumeScore, "/", atsScore);

    return res.status(200).json({ success: true, analysis, modelUsed });
  } catch (error) {
    console.error("=== ANALYSIS FAILED ===", error.message);
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
