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
      system: "You are a severe but useful venture investor. In 5 concise terminal lines, attack market, urgency, defensibility, and monetization. End with one action.",
    },
    {
      key: "security",
      title: "SECURITY ARCHITECT",
      system: "You are a strict security and data architect. In 5 concise terminal lines, identify privacy, auth, data, RLS, and operational risks. End with one architecture constraint.",
    },
    {
      key: "growth",
      title: "GROWTH OPERATOR",
      system: "You are an aggressive founder-led growth operator. In 5 concise terminal lines, identify distribution, proof, buyer objections, and first campaign. End with one launch move.",
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
