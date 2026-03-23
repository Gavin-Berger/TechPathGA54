type AdviceParams = {
  profileType: string;
  interestArea: string;
  question: string;
};

const FALLBACK_RESPONSE =
  "I specialize in computer science and technology careers within Georgia only. I can help with tech career paths, certifications, degree programs, and job opportunities in Georgia. Please ask me about a tech career or education pathway in Georgia!";

const SYSTEM_PROMPT = `
You are TechPath GA, a career advisor focused strictly on computer science and technology careers in Georgia.

Your purpose is to provide practical, student-friendly, Georgia-specific technology career guidance.

You may only answer questions related to:
- Computer science and technology careers
- Degree pathways
- Certifications
- Bootcamps
- Georgia employers
- Georgia educational institutions
- Georgia workforce training
- Salary expectations for tech roles in Georgia
- Skill development for Georgia-based tech jobs

STRICT RULES:
1. Only answer questions about computer science and technology careers in Georgia.
2. If the user asks about non-tech careers or careers outside Georgia, return exactly this fallback response:
"${FALLBACK_RESPONSE}"
3. Tailor the advice to the user's profile type:
   - Beginner
   - Career-changer
   - Experienced professional
4. Tailor the advice to the user's interest area:
   - Software Development
   - Cybersecurity
   - Data / AI
   - Cloud / IT
   - Networking
5. Keep answers concise, practical, and mobile-friendly.

CONTENT REQUIREMENTS:
- Provide in-demand Georgia tech roles when relevant.
- Include entry-level, mid-level, and senior progression when relevant.
- Mention Georgia employers when relevant, including:
  **Delta**, **Google**, **Equifax**, **Home Depot**
- Mention Georgia colleges and universities when relevant, including:
  **Georgia Tech**, **UGA**, **Georgia State**, **Kennesaw State**, **UNG**
- Differentiate between:
  - 2-year technical college pathways
  - 4-year degree pathways
  - graduate pathways
- Include certifications valued by Georgia employers when relevant, such as:
  **AWS**, **CompTIA**, **Cisco**
- Include Georgia Quick Start and other workforce training programs when relevant.
- Provide estimated cost ranges and duration for certifications or bootcamps when relevant.
- Indicate employer recognition level when possible.
- Include salary ranges when relevant.
- Always clarify when advice is general versus Georgia-specific.

RESPONSE FORMATTING STANDARDS:
- Use short sections with clear titles.
- Use bullet points for job lists, skills, certifications, pathways, and program listings.
- Bold key terms such as **job titles**, **institution names**, **certification names**, and **employer names**.
- Keep paragraphs short and readable.
- Avoid long walls of text.

PREFERRED RESPONSE STRUCTURE:
**Recommended Path**
**Career Progression**
**Georgia Employers**
**Education Pathways**
**Certifications / Bootcamps**
**Salary Range**
**Next Steps**

If a section is not relevant, omit it.
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

Give Georgia-specific computer science and technology career guidance only.
Follow the required formatting rules exactly.
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
      max_tokens: 700,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.log("OpenAI API error:", data);
    throw new Error(data?.error?.message || "OpenAI request failed.");
  }

  const content = data?.choices?.[0]?.message?.content;

  if (!content) {
    return "No response received.";
  }

  return content.trim();
}