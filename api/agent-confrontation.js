import { completeWithFallback } from "../lib/ai-fallback.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const body = req.body || {};
  const idea = [body.idea, body.customer, body.industry, body.concern, body.edge]
    .filter(Boolean)
    .join("\n");

  const agents = [
    {
      key: "vc",
      title: "CYNICAL VC",
      system: "You are a severe but useful venture investor. Return exactly 5 labeled lines using this format: Market: ... Urgency: ... Defensibility: ... Monetization: ... Action: ... Do not invent market-size numbers, growth rates, funding amounts, or named facts. If the input does not prove something, say unverified. Be sharp and specific.",
    },
    {
      key: "security",
      title: "SECURITY ARCHITECT",
      system: "You are a strict security and data architect. Return exactly 6 labeled lines using this format: Privacy Risk: ... Auth Risk: ... Data Risk: ... RLS Risk: ... Operational Risk: ... Architecture Constraint: ... Keep each line concrete and implementation-facing.",
    },
    {
      key: "growth",
      title: "GROWTH OPERATOR",
      system: "You are a founder-led growth operator. Return exactly 5 labeled lines using this format: Distribution: ... Proof: ... Buyer Objections: ... First Campaign: ... Launch Move: ... Do not invent traction. Focus on the first verifiable acquisition loop.",
    },
  ];

  try {
    const calls = agents.map(async (agent) => {
      try {
        const { content } = await completeWithFallback(agent.system, idea, { temperature: 0.45, maxTokens: 360 });
        return { ...agent, content: content || "No response." };
      } catch (error) {
        console.error(`agent ${agent.key} failed:`, error.message || error);
        return { ...agent, content: "agent unavailable: all providers failed" };
      }
    });

    const results = await Promise.all(calls);
    res.status(200).json({ agents: results });
  } catch (error) {
    res.status(500).json({ error: error.message || "Agent confrontation failed." });
  }
}
