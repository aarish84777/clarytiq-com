import fs from "fs";
import path from "path";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, userId } = req.body;

  if (!email || !userId) {
    return res.status(400).json({ error: "Missing email or userId" });
  }

const file = path.join(process.cwd(), "_data", "emailToUserId.json");



  // Create file if doesn't exist
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, "{}");
  }

  const db = JSON.parse(fs.readFileSync(file, "utf8"));

  // Save mapping
  db[email] = userId;

  fs.writeFileSync(file, JSON.stringify(db, null, 2));

  return res.status(200).json({ success: true });
}
