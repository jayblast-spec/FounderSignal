export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    res.status(501).json({ error: "GROQ_API_KEY is not configured for this deployment." });
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
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          temperature: 0.45,
          max_tokens: 360,
          messages: [
            { role: "system", content: agent.system },
            { role: "user", content: idea },
          ],
        }),
      });

      if (!response.ok) {
        return { ...agent, content: `agent unavailable: ${response.status}` };
      }

      const data = await response.json();
      return { ...agent, content: data.choices?.[0]?.message?.content || "No response." };
    });

    const results = await Promise.all(calls);
    res.status(200).json({ agents: results });
  } catch (error) {
    res.status(500).json({ error: error.message || "Agent confrontation failed." });
  }
}
