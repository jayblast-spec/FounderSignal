import { createHash } from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ success: false, error: "Method not allowed" });
    return;
  }

  const payload = req.body || {};
  const serialized = JSON.stringify(payload);
  const hash = createHash("sha256").update(serialized).digest("hex");
  const sessionId = `SESSION_${hash.slice(0, 4).toUpperCase()}_${hash.slice(4, 8).toUpperCase()}`;

  res.status(200).json({
    success: true,
    session_id: sessionId,
    content_hash: hash,
    status: "committed",
    destination: "ArkNet Digital Vault handoff",
  });
}
