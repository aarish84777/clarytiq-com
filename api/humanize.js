import Groq from "groq-sdk";

const TEMPLATES = {
  simple: `Rewrite the text in clear, simple, everyday human language.
- Natural tone
- Easy to read
- Remove robotic phrasing
- Keep meaning accurate
- Write as if explaining to someone young
- Use easy words
- you may use inconsistent anguage and give occasional errors`,

  simple_words: `Rewrite the text using extremely easy language.
Rules:
- Explain like to a 10-year-old
- Short sentences
- No academic vocabulary
- Make it ultra-easy to understand`,

  exam: `Rewrite the text in a clean, formal, school-exam tone.
- Structured
- Factual
- No slang
- Teacher-acceptable answers
- Write in bullet points
- CBSE-style academic tone
use bullet points as 1, 2, 3...`,

  genz: `Rewrite the text in an unhinged Gen-Z + Gen-Alpha tone with MAX dark humour and playful roasts.
Rules:
- Sarcastic, chaotic inner-monologue energy 😭💀
- Light, self-aware roasts about the topic and life
- Emojis sparingly but impactful (😭🔥💀🤌🫠)
- Dark humour allowed but:
  * NO violence
  * NO targeting groups
  * NO illegal themes
- Maintain factual accuracy
- Chaos only in delivery, not content
- No emoji spam
Vibe = Tired-but-genius teen explaining the topic at 3AM.`,

  cause_effect: `Rewrite the text using a clear CAUSE → EFFECT chain.
Rules:
- Break each idea into "Cause → Effect"
- Explain WHY something happened
- Then explain WHAT happened because of it
- Step-by-step logic
- Perfect for History, Civics, Biology, Science
Format example:
Cause →
Effect →
Repeat for all main ideas.
write it simple language of a 9 year old's academic vocabulary
logic in a way EVEN a half-slep child can understand.`  
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { preset, userText } = req.body;

    if (!userText) {
      return res.status(400).json({ error: "No text provided" });
    }

    const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const systemPrompt = TEMPLATES[preset] || TEMPLATES.simple;

    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userText }
      ],
      temperature: 0.4,
      max_tokens: 1500
    });

    const output = completion?.choices?.[0]?.message?.content || "";

    return res.status(200).json({ output });
  } catch (err) {
    console.error("HUMANIZE API ERROR:", err);
    return res.status(500).json({
      error: "Server error",
      details: err.message
    });
  }
}
