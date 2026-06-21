const axios = require("axios");
const { GoogleGenAI } = require("@google/genai");
const supabase = require("../supabase");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

exports.analyzeResume = async (req, res) => {
  try {
    const { userId, resumeUrl } = req.body;

    console.log("USER:", userId);
    console.log("RESUME URL:", resumeUrl);

    // Download PDF
    const pdfResponse = await axios.get(resumeUrl, {
      responseType: "arraybuffer",
    });

    console.log("PDF SIZE:", pdfResponse.data.length);

    // Convert PDF to Base64
    const pdfBase64 = Buffer.from(pdfResponse.data).toString("base64");

    // Send PDF directly to Gemini
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          inlineData: {
            mimeType: "application/pdf",
            data: pdfBase64,
          },
        },
        {
          text: `
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
  "missing_skill_list": [
    "Docker",
    "AWS",
    "Git",
    "MongoDB"
  ],
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
`,
        },
      ],
    });

    const aiResponse = response.text;

    console.log("AI RESPONSE:");
    console.log(aiResponse);

    const cleanedResponse = aiResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const analysis = JSON.parse(cleanedResponse);
    console.log("FULL ANALYSIS:");
    console.log(JSON.stringify(analysis, null, 2));

    console.log("MISSING SKILL LIST:");
    console.log(analysis.missing_skill_list);
    console.log("PARSED ANALYSIS:");
    console.log(analysis);

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
        {
          onConflict: "user_id",
        },
      )
      .select();

    if (error) {
      console.log("SUPABASE ERROR:", error);
      throw error;
    }

    console.log("SAVED DATA:", data);

    return res.status(200).json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.log("ERROR:");
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Analysis failed",
      error: error.message,
    });
  }
};
