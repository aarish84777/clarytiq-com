// /api/validate-key.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { key } = req.body || {};
  const secret = process.env.PRO_UNLOCK_SECRET;

  if (!key) return res.status(400).json({ ok: false, error: "Missing key" });

  if (key.trim() === secret) {
    return res.status(200).json({ ok: true });
  }

  return res.status(401).json({ ok: false, error: "Invalid key" });
}
