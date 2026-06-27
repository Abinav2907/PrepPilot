const axios = require("axios");
const { GoogleGenAI } = require("@google/genai");
const Groq = require("groq-sdk");
const supabase = require("../supabase");

const pdfParse = require("pdf-parse");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Gemini first (PDF support), Groq fallback (text only)
async function callAI(prompt, pdfBase64 = null, pdfBuffer = null) {
  try {
    const contents = pdfBase64
      ? [
          { inlineData: { mimeType: "application/pdf", data: pdfBase64 } },
          { text: prompt },
        ]
      : prompt;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
    });

    console.log("✅ Used: Gemini 2.5 Flash");
    return response.text;
  } catch (geminiErr) {
    console.warn("⚠️ Gemini failed:", geminiErr.message);
    console.log("🔄 Switching to Groq (Llama 3.3 70B)...");

    let textPrompt = prompt;
    if (pdfBuffer) {
      try {
        const parsed = await pdfParse(pdfBuffer);
        textPrompt = `${prompt}\n\nHere is the resume content extracted from PDF:\n${parsed.text}`;
        console.log("📄 Successfully parsed PDF text for Groq fallback.");
      } catch (parseErr) {
        console.error("❌ Failed to parse PDF text:", parseErr.message);
      }
    }

    const groqResponse = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: textPrompt }],
      temperature: 0.7,
    });

    console.log("✅ Used: Groq (Llama 3.3 70B)");
    return groqResponse.choices[0].message.content;
  }
}

// ─── Resume Analysis ──────────────────────────────────────────────
exports.analyzeResume = async (req, res) => {
  try {
    const { userId, resumeUrl } = req.body;

    console.log("USER:", userId);
    console.log("RESUME URL:", resumeUrl);

    // Fetch user profile to tailor analysis
    let profile = null;
    try {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();
      profile = profileData;
      console.log("Tailoring resume analysis for profile:", profile);
    } catch (profileErr) {
      console.warn("⚠️ Failed to fetch profile for resume analysis:", profileErr.message);
    }

    const targetRole = profile?.target_role || "Software Developer";
    const experienceLevel = profile?.degree || "Intermediate";

    let pdfBuffer;

    try {
      const fileName = resumeUrl.split("/").pop();
      console.log("Downloading via Supabase Storage Admin:", fileName);
      const { data: fileData, error: downloadError } = await supabase.storage
        .from("resumes")
        .download(fileName);

      if (downloadError) throw downloadError;
      pdfBuffer = Buffer.from(await fileData.arrayBuffer());
    } catch (supabaseErr) {
      console.warn("⚠️ Supabase admin download failed, falling back to axios.get:", supabaseErr.message);
      const pdfResponse = await axios.get(resumeUrl, {
        responseType: "arraybuffer",
      });
      pdfBuffer = Buffer.from(pdfResponse.data);
    }

    if (!pdfBuffer || pdfBuffer.length === 0) {
      throw new Error("Unable to download resume file from storage. Please verify the backend SUPABASE_SERVICE_ROLE_KEY is set to the Service Role Key (not the Anon Key) in your Render settings.");
    }

    console.log("PDF SIZE:", pdfBuffer.length);

    const pdfBase64 = pdfBuffer.toString("base64");

    const prompt = `
You are a senior technical recruiter and professional resume writer.
Analyze this candidate's resume for the role of: "${targetRole}" (${experienceLevel} level).

Strictly evaluate the resume against standard market requirements for "${targetRole}" and the candidate's actual qualifications.

Evaluation Metrics:
1. ATS Compatibility (Format, section headers, readability, and keyword match for "${targetRole}").
2. Core Technical Skills (Does the resume list relevant skills for "${targetRole}"? How many are matched vs. missing?).
3. Strengths (At least 2-3 specific, detailed professional highlights from the resume content).
4. Weaknesses (At least 2-3 specific gaps relative to the "${targetRole}" role, like missing skills or lack of projects/metrics).
5. Recommendations (Clear, actionable improvements for their resume, project section, or skills).

Special Rules:
- If the resume is empty, contains nonsense, or is extremely short/blank, you MUST score both resume_score and ats_score very low (e.g., between 5 and 30) and list "Missing resume content" or "Invalid format" as a major weakness.
- Generate realistic scores out of 100 based on actual content matching. Do not use fixed template values.
- Do NOT use generic template placeholders.
- missing_skill_list must contain actual missing technical skills needed for "${targetRole}" that are not present in the resume.
- Return at least 3 skills whenever possible.
- Do not leave missing_skill_list empty.

Return ONLY a valid JSON object matching this schema:
{
  "resume_score": number,
  "ats_score": number,
  "matched_skills": number,
  "missing_skills": number,
  "missing_skill_list": ["Docker", "AWS", "Git", "MongoDB"],
  "strengths": ["string"],
  "weaknesses": ["string"],
  "recommendations": ["string"]
}
`;

    const aiResponse = await callAI(prompt, pdfBase64, pdfBuffer);
    console.log("AI RESPONSE:", aiResponse);

    const cleaned = aiResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const analysis = JSON.parse(cleaned);
    console.log("FULL ANALYSIS:", JSON.stringify(analysis, null, 2));

    // Convert scores to integers out of 100 to prevent Postgres invalid input syntax errors
    let resumeScore = parseFloat(analysis.resume_score);
    let atsScore = parseFloat(analysis.ats_score);

    // If the model returned a float between 0 and 1 (e.g. 0.85), scale it to 100 (e.g. 85)
    if (resumeScore <= 1.0 && resumeScore > 0) {
      resumeScore = Math.round(resumeScore * 100);
    } else {
      resumeScore = Math.round(resumeScore) || 80;
    }

    if (atsScore <= 1.0 && atsScore > 0) {
      atsScore = Math.round(atsScore * 100);
    } else {
      atsScore = Math.round(atsScore) || 80;
    }

    resumeScore = Math.max(0, Math.min(100, resumeScore));
    atsScore = Math.max(0, Math.min(100, atsScore));

    const matchedSkills = Math.round(parseFloat(analysis.matched_skills)) || 0;
    const missingSkills = Math.round(parseFloat(analysis.missing_skills)) || 0;

    // Update analysis object with normalized values
    analysis.resume_score = resumeScore;
    analysis.ats_score = atsScore;
    analysis.matched_skills = matchedSkills;
    analysis.missing_skills = missingSkills;

    const { data, error } = await supabase
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
        { onConflict: "user_id" },
      )
      .select();

    if (error) {
      console.log("SUPABASE ERROR:", error);
      throw new Error(`Database error saving analysis: ${error.message}`);
    }

    console.log("SAVED DATA:", data);

    return res.status(200).json({ success: true, analysis });
  } catch (error) {
    console.error("ANALYSIS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Analysis failed",
      error: error.message,
    });
  }
};

// ─── Download PDF Report ──────────────────────────────────────────
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
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    const doc = new PDFDocument();

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=PrepPilot_Report.pdf",
    );
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
    data.missing_skill_list?.forEach((item) =>
      doc.fontSize(12).text(`• ${item}`),
    );
    doc.moveDown();

    doc.fontSize(18).text("AI Recommendations");
    data.recommendations?.forEach((item) => doc.fontSize(12).text(`• ${item}`));

    doc.end();
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Failed to generate PDF",
    });
  }
};
