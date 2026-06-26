const { GoogleGenAI } = require("@google/genai");
const supabase = require("../supabase");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

exports.evaluateInterview = async (req, res) => {
  try {
    const { userId, questions, answers } = req.body;

    const prompt = `
You are a senior technical interviewer.

Evaluate these interview answers.

Questions:
${questions.map((q, i) => `${i + 1}. ${q}`).join("\n")}

Answers:
${answers.map((a, i) => `${i + 1}. ${a}`).join("\n")}

Evaluate:

1. Technical Knowledge
2. Communication
3. Confidence
4. Overall Performance

Return ONLY valid JSON.

{
  "overallScore":85,
  "technical":84,
  "communication":80,
  "confidence":82,
  "strengths":[
    "...",
    "...",
    "..."
  ],
  "weaknesses":[
    "...",
    "...",
    "..."
  ],
  "feedback":[
    "...",
    "...",
    "..."
  ]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const cleaned = response.text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const result = JSON.parse(cleaned);

    console.log(result);

    // Save to Supabase (optional)
    if (userId) {
      await supabase.from("interview_results").insert([
        {
          user_id: userId,
          overall_score: result.overallScore,
          technical_score: result.technical,
          communication_score: result.communication,
          confidence_score: result.confidence,
          strengths: result.strengths,
          weaknesses: result.weaknesses,
          feedback: result.feedback,
        },
      ]);
    }

    // IMPORTANT: Return response to frontend
    return res.status(200).json({
      success: true,
      overallScore: result.overallScore,
      technical: result.technical,
      communication: result.communication,
      confidence: result.confidence,
      strengths: result.strengths,
      weaknesses: result.weaknesses,
      feedback: result.feedback,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Evaluation failed",
      error: err.message,
    });
  }
};
exports.generateInterview = async (req, res) => {
  try {
    const { category, role, difficulty, experience, skills } = req.body;

    let totalQuestions = 5;

    if (difficulty === "Intermediate") totalQuestions = 7;
    if (difficulty === "Advanced") totalQuestions = 10;

    const prompt = `
You are a senior technical interviewer.

Generate interview questions.

Category:
${category}

Job Role:
${role}

Experience:
${experience}

Difficulty:
${difficulty}

Skills:
${skills.join(", ")}

Rules:

- Generate exactly ${totalQuestions} questions.
- Questions must match the candidate's role.
- Questions must match the difficulty.
- Do not repeat questions.
- Return ONLY JSON.

{
  "questions":[
    "Question 1",
    "Question 2"
  ]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const cleaned = response.text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const result = JSON.parse(cleaned);

    return res.status(200).json({
      success: true,
      questions: result.questions,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Failed to generate interview questions",
    });
  }
};
