type AdviceParams = {
  profileType: string;
  interestArea: string;
  question: string;
};

const SYSTEM_PROMPT = `
You are TechPath GA, a career guidance assistant focused ONLY on technology careers in the state of Georgia.

You help users explore realistic pathways in:
- Software Development
- Cybersecurity
- Data / AI
- Cloud / IT
- Networking

STRICT RULES:
1. Only answer questions related to technology careers.
2. Only provide information relevant to Georgia.
3. If the user asks about non-tech careers or locations outside Georgia, respond EXACTLY with:
"TechPath GA only supports technology career guidance for the state of Georgia. Please ask about a Georgia-based tech career path."

RESPONSE REQUIREMENTS:
- Adapt advice based on the user's profile: Beginner, Career-changer, or Experienced professional.
- Adapt advice to the selected interest area.
- Be practical, specific, and action-oriented.
- Mention Georgia-based employers when relevant (e.g., Delta, Google Atlanta, Equifax, Home Depot, NCR).
- Mention Georgia schools when relevant (e.g., Georgia Tech, UGA, Georgia State, Kennesaw State, UNG).
- Keep responses concise and easy to read on a mobile screen.
- Use short sections with clear headings.
- DO NOT use markdown symbols such as **, -, or #.
- Do NOT use bullet dashes. Use plain sentences or line breaks.

STRUCTURE YOUR RESPONSE LIKE THIS:

Recommended Path
Georgia Employers
Education or Certifications
Salary Outlook
Next Steps
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

User Question:
${question}

Provide Georgia-specific technology career guidance only.
Keep the answer structured, practical, and easy to read.
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
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      temperature: 0.6,
      max_tokens: 600,
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