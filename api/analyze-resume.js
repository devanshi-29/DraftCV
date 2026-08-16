import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { resume, jobDescription } = req.body;

    if (!resume || !jobDescription) {
      return res.status(400).json({
        error: "Resume and job description are required"
      });
    }

    const prompt = `
You are an expert ATS resume analyzer.

Analyze the provided resume against the provided job description.

Calculate an ATS compatibility score from 0 to 100 using EXACTLY this scoring system:

1. Keyword Match — 40 points
- Compare important keywords and phrases in the job description with the resume.
- Give points only for keywords that are actually present in the resume.
- Do not assume or invent keywords.

2. Relevant Skills — 30 points
- Compare technical and professional skills required by the job description with the skills actually present in the resume.
- Give higher points when important required skills are clearly present.
- Do not give points for skills that are not present.

3. Experience & Projects Relevance — 20 points
- Check whether the candidate's experience and projects are relevant to the job description.
- Consider technologies, responsibilities, and demonstrated work.
- Do not assume experience that is not explicitly mentioned.

4. Resume Structure & Clarity — 10 points
- Check whether the resume has clear sections such as Summary, Experience, Education, Projects, Skills, and Certifications where applicable.
- Consider readability, consistency, and clarity.

IMPORTANT RULES:
- The final score MUST be between 0 and 100.
- Do not invent experience, skills, achievements, qualifications, or projects.
- Do not give points for information that is not present in the resume.
- Base the score ONLY on the provided resume and job description.
- Missing information should reduce the score where relevant.
- Return ONLY valid JSON.
- Do not include markdown or explanations outside the JSON.

Return exactly this structure:

{
  "atsScore": number,
  "scoreBreakdown": {
    "keywordMatch": number,
    "relevantSkills": number,
    "experienceProjects": number,
    "structureClarity": number
  },
  "matchedKeywords": [],
  "missingKeywords": [],
  "missingSkills": [],
  "resumeImprovements": [],
  "improvedSummary": "",
  "experienceSuggestions": [],
  "projectSuggestions": []
}

SCORING VALIDATION:
- keywordMatch must be between 0 and 40.
- relevantSkills must be between 0 and 30.
- experienceProjects must be between 0 and 20.
- structureClarity must be between 0 and 10.
- atsScore MUST equal:
  keywordMatch + relevantSkills + experienceProjects + structureClarity.

RESUME:
${JSON.stringify(resume)}

JOB DESCRIPTION:
${jobDescription}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt
    });

    const text = response.text;

    const cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const result = JSON.parse(cleanedText);

    return res.status(200).json(result);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "AI analysis failed"
    });
  }
}