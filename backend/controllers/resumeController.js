const { GoogleGenAI } = require("@google/genai");
const Groq = require("groq-sdk");
const supabase = require("../supabase");
const pdfParse = require("pdf-parse");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ── Build analysis prompt ─────────────────────────────────────────────────────
function buildPrompt(targetRole, experienceLevel) {
  return `You are a senior technical recruiter and professional resume writer.
Read the PDF document provided and analyze the resume for the role: "${targetRole}" (${experienceLevel} level).

STRICT RULES:
- Read ALL content in the PDF carefully before scoring.
- If the PDF is empty or has no resume content → score resume_score and ats_score between 5 and 25.
- If the PDF has real resume content → score accurately based on actual skills, projects, experience found.
- DO NOT return the same fixed values every time. Scores must reflect actual resume content.
- missing_skill_list: list real technical skills required for "${targetRole}" NOT found in the resume.
- Return at least 3 items in missing_skill_list.
- Return ONLY a raw JSON object — NO markdown fences, NO extra text, NO explanation.

JSON schema to return:
{
  "resume_score": <number 0-100>,
  "ats_score": <number 0-100>,
  "matched_skills": <number>,
  "missing_skills": <number>,
  "missing_skill_list": ["skill1", "skill2", "skill3"],
  "strengths": ["specific strength from the resume"],
  "weaknesses": ["specific weakness relative to the role"],
  "recommendations": ["specific actionable improvement"]
}`;
}

// ── Gemini call (sends PDF bytes natively — no text extraction needed) ─────────
async function callGemini(model, pdfBase64, prompt) {
  console.log(`📤 Calling ${model}...`);
  const response = await ai.models.generateContent({
    model,
    contents: [
      { inlineData: { mimeType: "application/pdf", data: pdfBase64 } },
      { text: prompt },
    ],
  });
  const text = response.text;
  if (!text || text.trim().length === 0) {
    throw new Error(`${model} returned empty response`);
  }
  console.log(`✅ ${model} succeeded`);
  return text;
}

// ── Groq call (last resort — uses extracted text) ─────────────────────────────
async function callGroq(pdfBuffer, prompt) {
  console.log("📤 Calling Groq (last resort with extracted text)...");
  let extractedText = "";
  try {
    const parsed = await pdfParse(pdfBuffer);
    extractedText = (parsed.text || "").trim();
    console.log("pdf-parse extracted:", extractedText.length, "chars");
  } catch (e) {
    console.warn("pdf-parse failed:", e.message);
  }

  const fullPrompt = extractedText.length > 100
    ? `${prompt}\n\n=== RESUME TEXT ===\n${extractedText}\n=== END ===`
    : `${prompt}\n\n[RESUME IS EMPTY OR UNREADABLE. Score resume_score=10, ats_score=8, matched_skills=0, missing_skills=10]`;

  const resp = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: fullPrompt }],
    temperature: 0.1,
    max_tokens: 1500,
  });
  console.log("✅ Groq succeeded");
  return resp.choices[0].message.content;
}

// ── Parse JSON from AI response (handles markdown fences) ────────────────────
function parseJSON(raw) {
  const cleaned = (raw || "")
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/gi, "")
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch (_) {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error("AI returned no valid JSON");
  }
}

// ── Normalise a score value to 0-100 integer ─────────────────────────────────
function normaliseScore(val) {
  let n = parseFloat(val) || 0;
  if (n > 0 && n <= 1) n = Math.round(n * 100);
  else n = Math.round(n);
  return Math.max(0, Math.min(100, n));
}

// ─── Resume Analysis ──────────────────────────────────────────────────────────
exports.analyzeResume = async (req, res) => {
  try {
    const userId = req.body.userId;
    const file = req.file; // set by multer

    console.log("\n=== ANALYSE RESUME ===");
    console.log("USER:", userId);
    console.log("FILE:", file ? `${file.originalname} (${file.size} bytes)` : "MISSING");

    if (!userId) {
      return res.status(400).json({ success: false, message: "userId is required" });
    }
    if (!file || !file.buffer || file.buffer.length === 0) {
      return res.status(400).json({ success: false, message: "Resume file is required" });
    }

    const pdfBuffer = file.buffer;
    const pdfBase64 = pdfBuffer.toString("base64");
    console.log("PDF buffer size:", pdfBuffer.length, "bytes");

    // ── Save to Supabase Storage ──────────────────────────────────────────────
    const extension = (file.originalname.split(".").pop() || "pdf").toLowerCase();
    const storageFileName = `${userId}.${extension}`;

    const { error: storageErr } = await supabase.storage
      .from("resumes")
      .upload(storageFileName, pdfBuffer, {
        upsert: true,
        contentType: file.mimetype || "application/pdf",
      });
    if (storageErr) {
      console.warn("Storage upload warning:", storageErr.message);
    } else {
      console.log("✅ Saved to storage:", storageFileName);
    }

    // ── Update resumes table (delete old + insert fresh to avoid upsert issues) ──
    const { data: publicUrlData } = supabase.storage
      .from("resumes")
      .getPublicUrl(storageFileName);
    const fileUrl = publicUrlData?.publicUrl || "";

    // Delete existing record first, then insert fresh — avoids stale file_name issues
    await supabase.from("resumes").delete().eq("user_id", userId);
    const { error: insertErr } = await supabase.from("resumes").insert({
      user_id: userId,
      file_name: file.originalname,
      file_url: fileUrl,
    });
    if (insertErr) {
      console.warn("resumes table insert warning:", insertErr.message);
    } else {
      console.log("✅ resumes table updated:", file.originalname);
    }

    // ── Fetch user profile ────────────────────────────────────────────────────
    let profile = null;
    try {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();
      profile = data;
    } catch (e) {
      console.warn("Profile fetch failed:", e.message);
    }

    const targetRole = profile?.target_role || "Software Developer";
    const experienceLevel = profile?.degree || "Intermediate";
    const prompt = buildPrompt(targetRole, experienceLevel);

    console.log("Target role:", targetRole, "| Level:", experienceLevel);

    // ── Call AI: Gemini 2.5 Flash → Gemini 2.0 Flash → Groq ─────────────────
    let rawResponse = null;
    let modelUsed = "";

    // 1st preference: Gemini 2.5 Flash (native PDF vision)
    try {
      rawResponse = await callGemini("gemini-2.5-flash", pdfBase64, prompt);
      modelUsed = "gemini-2.5-flash";
    } catch (e1) {
      console.warn("⚠️  gemini-2.5-flash failed:", e1.message);

      // 2nd preference: Gemini 2.0 Flash
      try {
        rawResponse = await callGemini("gemini-2.0-flash", pdfBase64, prompt);
        modelUsed = "gemini-2.0-flash";
      } catch (e2) {
        console.warn("⚠️  gemini-2.0-flash failed:", e2.message);

        // Last resort: Groq with extracted text
        try {
          rawResponse = await callGroq(pdfBuffer, prompt);
          modelUsed = "groq-llama-3.3-70b";
        } catch (e3) {
          console.error("❌ All AI models failed");
          throw new Error(
            `All AI models failed — 2.5: ${e1.message} | 2.0: ${e2.message} | Groq: ${e3.message}`
          );
        }
      }
    }

    console.log("Model used:", modelUsed);
    console.log("Raw response (first 400 chars):", rawResponse?.substring(0, 400));

    // ── Parse and normalise ───────────────────────────────────────────────────
    const analysis = parseJSON(rawResponse);
    console.log("Parsed analysis:", JSON.stringify(analysis, null, 2));

    const resumeScore = normaliseScore(analysis.resume_score);
    const atsScore = normaliseScore(analysis.ats_score);
    const matchedSkills = Math.max(0, Math.round(parseFloat(analysis.matched_skills)) || 0);
    const missingSkills = Math.max(0, Math.round(parseFloat(analysis.missing_skills)) || 0);

    analysis.resume_score = resumeScore;
    analysis.ats_score = atsScore;
    analysis.matched_skills = matchedSkills;
    analysis.missing_skills = missingSkills;

    // ── Save to resume_analysis ───────────────────────────────────────────────
    const { error: dbErr } = await supabase
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

    if (dbErr) {
      console.error("DB upsert error:", dbErr);
      throw new Error(`DB error: ${dbErr.message}`);
    }

    console.log(`✅ Done — ${modelUsed} scored resume ${resumeScore}/100`);
    return res.status(200).json({ success: true, analysis, modelUsed });

  } catch (err) {
    console.error("=== ANALYSIS ERROR ===", err.message);
    return res.status(500).json({ success: false, message: err.message });
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
    data.strengths?.forEach((s) => doc.fontSize(12).text(`• ${s}`));
    doc.moveDown();
    doc.fontSize(18).text("Weaknesses");
    data.weaknesses?.forEach((w) => doc.fontSize(12).text(`• ${w}`));
    doc.moveDown();
    doc.fontSize(18).text("Recommended Skills");
    data.missing_skill_list?.forEach((s) => doc.fontSize(12).text(`• ${s}`));
    doc.moveDown();
    doc.fontSize(18).text("AI Recommendations");
    data.recommendations?.forEach((r) => doc.fontSize(12).text(`• ${r}`));
    doc.end();
  } catch (err) {
    console.error("downloadReport error:", err);
    return res.status(500).json({ success: false, message: "Failed to generate PDF" });
  }
};
