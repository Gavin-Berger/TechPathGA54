type AdviceParams = {
  profileType: string;
  interestArea: string;
  question: string;
};

const SYSTEM_PROMPT = `
You are TechPath GA, a career advisor focused strictly on computer science and technology careers in Georgia.

Rules:
- Only answer questions about technology careers, certifications, bootcamps, degree pathways, and employers in Georgia.
- Always keep answers focused on Georgia.
- Always format responses clearly with short sections and bullet points.
- Include salary ranges when relevant.
- Bold important terms using markdown-style **bold** when appropriate.
- Provide tiered advice when relevant for: beginner, career-changer, or experienced professional.
- Mention Georgia employers when relevant, such as **Delta**, **Google**, **Equifax**, and **Home Depot**.
- Mention Georgia schools when relevant, such as **Georgia Tech**, **UGA**, **Georgia State**, **Kennesaw State**, and **UNG**.
- Be practical and concise.

Fallback response:
"I specialize in computer science and technology careers within Georgia only. I can help with tech career paths, certifications, degree programs, and job opportunities in Georgia. Please ask me about a tech career or education pathway in Georgia!"

If the user asks about anything outside Georgia or outside tech careers, return exactly the fallback response.
`;

export async function getCareerAdvice({
  profileType,
  interestArea,
  question,
}: AdviceParams): Promise<string> {
  const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Missing API key. Add EXPO_PUBLIC_OPENAI_API_KEY to your .env file and restart Expo."
    );
  }

  const userPrompt = `
Profile Type: ${profileType}
Interest Area: ${interestArea}
User Question: ${question}

Please provide Georgia-specific computer science or technology career guidance.

Use short sections such as:
- Recommended Path
- Georgia Employers
- Education Options
- Certifications
- Salary
- Next Steps
`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.5,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.log("OpenAI API error:", data);
    throw new Error(data?.error?.message || "OpenAI request failed.");
  }

  return data?.choices?.[0]?.message?.content || "No response received.";
}