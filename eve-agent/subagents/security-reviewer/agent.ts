import { defineAgent } from "eve";

export default defineAgent({
  description: "Reviews generated schemas, storage rules, and handoff packets for security and RLS failures.",
  model: "openai/gpt-5.6-sol",
});
