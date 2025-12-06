// /api/humanize.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { preset, text } = req.body || {};

    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Missing 'text'" });
    }

    const prompts = {
      simple: `
Rewrite the text in simple, natural, clean human language.
Keep all facts. No new ideas. No slang.
      `,
      exam: `
Rewrite the text in exam-ready CBSE style.
Short points, headings, bold keywords, clean answers.
      `,
      genz: `
Rewrite the text casually, friendly, Gen-Z tone, light emojis.
Keep facts. Do not remove definitions.
      `,
      teacher: `
Rewrite the text in formal, school-teacher-safe English.
No slang. No emojis. Structured, clean, accurate.
      `,
    };

    const instructions = prompts[preset] || prompts.simple;

    // --- OpenAI API call ---
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        instructions,
        input: text,
        max_output_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenAI failed:", errText);
      return res.status(500).json({ error: "AI failed" });
    }

    const data = await response.json();

    const output =
      data.output?.[0]?.content?.[0]?.text ||
      data.output?.[0]?.output_text ||
      "Error: No output returned.";

    return res.status(200).json({ text: output.trim() });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
