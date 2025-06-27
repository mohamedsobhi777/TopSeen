import {
  StateGraph,
  START,
  END,
  Command,
  LangGraphRunnableConfig,
} from "@langchain/langgraph";
import { graph as contentCreatorGraph } from "./agent-mode";
import {
  SupervisorAnnotation,
  SupervisorState,
  SupervisorZodConfiguration,
} from "./supervisor-types";
import { chatMode } from "./chat-mode";

export async function router(
  state: SupervisorState,
  config: LangGraphRunnableConfig,
): Promise<Command> {
  const mode = config.configurable?.mode;
  return new Command({
    goto: mode,
  });
}

const builder = new StateGraph(SupervisorAnnotation, SupervisorZodConfiguration)
  .addNode("router", router, {
    ends: ["agentMode", "chatMode"],
  })
  .addNode("agentMode", contentCreatorGraph)
  .addNode("chatMode", chatMode)
  .addEdge(START, "router")
  .addEdge("agentMode", END)
  .addEdge("chatMode", END);

export const graph = builder.compile();
graph.name = "Generative UI Agent";
