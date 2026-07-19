import { defineAgent } from "eve";

export default defineAgent({
  model: "openai/gpt-5.6-sol",
  description: "Compiles raw founder intent into production-ready specifications, schemas, tasks, and deployment handoff packets.",
});
