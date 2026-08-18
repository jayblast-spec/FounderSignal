/**
 * Multi-provider LLM fallback chain: Groq -> Gemini -> OpenRouter -> NVIDIA
 * -> Cohere -> HuggingFace. Tries each provider whose API key is configured,
 * in order, and returns the first successful completion. A provider that
 * errors or times out is skipped, not fatal — the chain only fails if every
 * configured provider fails.
 */

async function callOpenAICompatible(endpoint, model, apiKey, systemPrompt, userPrompt, opts, extraHeaders = {}) {
  const res = await fetch(`${endpoint}/chat/completions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", ...extraHeaders },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: opts.temperature,
      max_tokens: opts.maxTokens,
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`request failed (${res.status}): ${body.slice(0, 200)}`);
  }
  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content) throw new Error("no text content returned");
  return content;
}

const PROVIDERS = [
  {
    name: "groq",
    envVar: "GROQ_API_KEY",
    call: (apiKey, sys, user, opts) =>
      callOpenAICompatible("https://api.groq.com/openai/v1", "llama-3.3-70b-versatile", apiKey, sys, user, opts),
  },
  {
    name: "gemini",
    envVar: "GEMINI_API_KEY",
    call: async (apiKey, sys, user, opts) => {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: sys }] },
            contents: [{ parts: [{ text: user }] }],
            generationConfig: { temperature: opts.temperature, maxOutputTokens: opts.maxTokens },
          }),
        }
      );
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(`request failed (${res.status}): ${body.slice(0, 200)}`);
      }
      const data = await res.json();
      const content = data?.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("");
      if (!content) throw new Error("no text content returned");
      return content;
    },
  },
  {
    name: "openrouter",
    envVar: "OPENROUTER_API_KEY",
    call: (apiKey, sys, user, opts) =>
      callOpenAICompatible("https://openrouter.ai/api/v1", "openai/gpt-oss-20b:free", apiKey, sys, user, opts),
  },
  {
    name: "nvidia",
    envVar: "NVIDIA_API_KEY",
    call: (apiKey, sys, user, opts) =>
      callOpenAICompatible("https://integrate.api.nvidia.com/v1", "meta/llama-3.1-8b-instruct", apiKey, sys, user, opts),
  },
  {
    name: "cohere",
    envVar: "COHERE_API_KEY",
    call: async (apiKey, sys, user, opts) => {
      const res = await fetch("https://api.cohere.com/v2/chat", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "command-a-03-2025",
          messages: [
            { role: "system", content: sys },
            { role: "user", content: user },
          ],
          temperature: opts.temperature,
          max_tokens: opts.maxTokens,
        }),
      });
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(`request failed (${res.status}): ${body.slice(0, 200)}`);
      }
      const data = await res.json();
      const content = data?.message?.content?.map((p) => p.text ?? "").join("");
      if (!content) throw new Error("no text content returned");
      return content;
    },
  },
  {
    name: "huggingface",
    envVar: "HUGGINGFACE_API_KEY",
    call: (apiKey, sys, user, opts) =>
      callOpenAICompatible("https://router.huggingface.co/v1", "meta-llama/Llama-3.1-8B-Instruct", apiKey, sys, user, opts),
  },
];

/**
 * Tries each configured provider in order (Groq first) and returns the
 * first successful completion. Throws only if every provider with a
 * configured key fails, or if no provider has a key configured at all.
 */
export async function completeWithFallback(systemPrompt, userPrompt, options = {}) {
  const opts = {
    temperature: options.temperature ?? 0.3,
    maxTokens: options.maxTokens ?? 2000,
  };

  const errors = [];
  let attempted = 0;

  for (const provider of PROVIDERS) {
    const apiKey = process.env[provider.envVar];
    if (!apiKey) continue;
    attempted += 1;
    try {
      const content = await provider.call(apiKey, systemPrompt, userPrompt, opts);
      return { content, provider: provider.name };
    } catch (err) {
      errors.push(`${provider.name}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  if (attempted === 0) {
    throw new Error("No AI provider is configured (no provider API key found in environment).");
  }
  throw new Error(`All configured AI providers failed:\n${errors.join("\n")}`);
}
