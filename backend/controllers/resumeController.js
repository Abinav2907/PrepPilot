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

    console.log("PDF SIZE:", pdfBuffer.length);

    const pdfBase64 = pdfBuffer.toString("base64");

    const prompt = `
Analyze this resume thoroughly.

Evaluate:
1. Resume quality
2. ATS compatibility
3. Technical skills
4. Projects
5. Experience
6. Certifications
7. Education

Return ONLY valid JSON:
{
  "resume_score": number,
  "ats_score": number,
  "matched_skills": number,
  "missing_skills": number,
  "missing_skill_list": ["Docker", "AWS", "Git", "MongoDB"],
  "strengths": [],
  "weaknesses": [],
  "recommendations": []
}

Rules:
- Generate realistic scores.
- Do not use fixed values.
- Score based on actual resume content.
- Return only JSON.
- missing_skill_list must contain actual missing technical skills.
- Return at least 3 skills whenever possible.
- Do not leave missing_skill_list empty.
`;

    const aiResponse = await callAI(prompt, pdfBase64, pdfBuffer);
    console.log("AI RESPONSE:", aiResponse);

    const cleaned = aiResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const analysis = JSON.parse(cleaned);
    console.log("FULL ANALYSIS:", JSON.stringify(analysis, null, 2));

    const { data, error } = await supabase
      .from("resume_analysis")
      .upsert(
        {
          user_id: userId,
          resume_score: analysis.resume_score,
          ats_score: analysis.ats_score,
          matched_skills: analysis.matched_skills,
          missing_skills: analysis.missing_skills,
          missing_skill_list: analysis.missing_skill_list,
          strengths: analysis.strengths,
          weaknesses: analysis.weaknesses,
          recommendations: analysis.recommendations,
        },
        { onConflict: "user_id" },
      )
      .select();

    if (error) {
      console.log("SUPABASE ERROR:", error);
      throw error;
    }

    console.log("SAVED DATA:", data);

    return res.status(200).json({ success: true, analysis });
  } catch (error) {
    console.log("ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Analysis failed",
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
