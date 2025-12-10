import crypto from "crypto";
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  const SECRET = process.env.LEMON_SQUEEZY_SECRET;

  const raw = JSON.stringify(req.body);
  const signature = req.headers["x-signature"];

  const hash = crypto
    .createHmac("sha256", SECRET)
    .update(raw)
    .digest("hex");

  if (signature !== hash) {
    return res.status(401).json({ message: "Invalid signature" });
  }

  const event = req.body;
  const email = event?.data?.attributes?.user_email;

  if (!email) {
    return res.status(200).json({ message: "No email found" });
  }

  const eventName = event.meta.event_name;

  const file = path.join(process.cwd(), "proUsers.json");
  if (!fs.existsSync(file)) fs.writeFileSync(file, JSON.stringify({}));

  const db = JSON.parse(fs.readFileSync(file, "utf8"));

  if (
    eventName === "order_created" ||
    eventName === "invoice_payment_succeeded" ||
    eventName === "subscription_created"
  ) {
    db[email] = true;
  }

  if (eventName === "subscription_cancelled") {
    db[email] = false;
  }

  fs.writeFileSync(file, JSON.stringify(db, null, 2));

  return res.status(200).json({ success: true });
}
