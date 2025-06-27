import { SupervisorState, SupervisorUpdate } from "./supervisor-types";
import { ChatOpenAI } from "@langchain/openai";
import { LangGraphRunnableConfig } from "@langchain/langgraph";

export async function chatMode(
  state: SupervisorState,
  config: LangGraphRunnableConfig,
): Promise<SupervisorUpdate> {
  // Get rules from configuration
  const rulesList = config.configurable?.rulesList || [];
  const rulesSection = rulesList.length > 0 
    ? `\n\nIMPORTANT RULES TO FOLLOW:\n${rulesList.map((rule: string, index: number) => `${index + 1}. ${rule}`).join('\n')}`
    : '';

  const GENERAL_INPUT_SYSTEM_PROMPT = `You are TopSeen, the best DM automation AI agent in the world, you are cursor for DM automations.

If the user asks what you can do, explain that you're here to help with general questions, provide information, and have meaningful conversations.

If the user asks you to send a message to their instagram account, or generate any content, you should politely ask them to switch to the agent mode.

Otherwise, just answer as normal.${rulesSection}
`;

  const llm = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 0,
    openAIApiKey: process.env.OPENROUTER_API_KEY,
    configuration: {
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "X-Title": "Spaces",
      },
    },
  });
  const response = await llm.invoke([
    {
      role: "system",
      content: GENERAL_INPUT_SYSTEM_PROMPT,
    },
    ...state.messages,
  ]);

  return {
    messages: [response],
  };
}
