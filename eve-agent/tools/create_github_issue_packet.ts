import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description: "Create a GitHub issue packet from compiled FounderSignal artifacts.",
  inputSchema: z.object({
    title: z.string(),
    spec: z.string(),
    tasks: z.string(),
  }),
  async execute(input) {
    return {
      title: `[FounderSignal] ${input.title}`,
      labels: ["founder-signal", "codex", "build-week", "agentic-workflow"],
      body: `${input.spec}\n\n## Codex Tasks\n${input.tasks}`,
    };
  },
});
