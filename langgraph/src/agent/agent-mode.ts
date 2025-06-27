import {
  Annotation,
  END,
  LangGraphRunnableConfig,
  START,
  StateGraph,
} from "@langchain/langgraph";
import { GenerativeUIAnnotation } from "./types";
import { AIMessage, ToolMessage } from "@langchain/core/messages";
import { MultiServerMCPClient } from "@langchain/mcp-adapters";
import { ChatOpenAI } from "@langchain/openai";
import * as fs from "fs";
import * as path from "path";
import { randomUUID } from "crypto";

const AgentModeAnnotation = Annotation.Root({
  messages: GenerativeUIAnnotation.spec.messages,
});

// Helper function to generate system prompt with rules
const generateSystemPrompt = (rulesList: string[] = []): string => {
  const rulesSection = rulesList.length > 0 
    ? `\n\nIMPORTANT RULES TO FOLLOW:\n${rulesList.map((rule: string, index: number) => `${index + 1}. ${rule}`).join('\n')}`
    : '';

  return `You are TopSeen, the best DM automation AI agent in the world, you are cursor for DM automations.

When the user asks what you can do, describe these specific tools and their capabilities.

If the last message is a tool result:
- Describe what action was performed
- Congratulate the user on the successful action
- Provide a clear and engaging follow-up message

For general requests:
- Be proactive in suggesting when tools might be helpful
- Offer to create memes when conversations involve humor, trends, or situations that would benefit from visual content
- Suggest Instagram automation when discussing social media strategy or content planning

Always be helpful, creative, and engaging in your responses.

You should be brief and to the point, and you should be very helpful and creative.

${rulesSection}
`;
};

const client = new MultiServerMCPClient({
  mcpServers: {
    // "mcp-hfspace": {
    //   command: "npx",
    //   args: [
    //     "-y",
    //     "@llmindset/mcp-hfspace",
    //     "--work-dir=/Users/mohamedmorsi/Business/TopSeen/frontend/public/storage",
    //     // "shuttleai/shuttle-jaguar",
    //     // "black-forest-labs/FLUX.1-schnell",
    //     // "styletts2/styletts2",
    //     // "Qwen/QVQ-72B-preview",
    //     "Agents-MCP-Hackathon/meme-context-protocol",
    //     "--HF_TOKEN=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",
    //   ],
    // }

    "hf-mcp-server": {
      url: "https://huggingface.co/mcp",
      headers: {
        Authorization: "Bearer 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",
      },
      args: [
        "--work-dir=/Users/mohamedmorsi/Business/TopSeen/frontend/public/storage",
      ],
    },

    instagram_dms: {
      command: "uv",
      args: [
        "run",
        "--directory",
        "/Users/mohamedmorsi/Business/TopSeen/instagram_dm_mcp",
        "python",
        "src/mcp_server.py",
      ],
    },
  },
});

const tools = await client.getTools();

const STORAGE_PATH =
  "/Users/mohamedmorsi/Business/TopSeen/frontend/public/storage";

// Ensure storage directory exists
if (!fs.existsSync(STORAGE_PATH)) {
  fs.mkdirSync(STORAGE_PATH, { recursive: true });
}

// Helper function to download image from URL and save locally
const downloadImage = async (imageUrl: string): Promise<string> => {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    
    const buffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);
    
    // Generate unique filename with proper extension
    const urlObj = new URL(imageUrl);
    const originalExt = path.extname(urlObj.pathname) || '.jpg';
    const filename = `${randomUUID()}${originalExt}`;
    const localPath = path.join(STORAGE_PATH, filename);
    
    // Write the file
    fs.writeFileSync(localPath, uint8Array);
    
    // Return relative path from public directory
    return ` ${STORAGE_PATH}/${filename}`;
  } catch (error) {
    console.error('Error downloading image:', error);
    throw error;
  }
};

// Helper function to detect and process image URLs in content
const processImageUrls = async (content: any): Promise<any> => {
  if (typeof content === 'string') {
    // Check if the content contains URLs pointing to images
    // Updated regex to capture just the URL part, not any prefix text
    const urlRegex = /(https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp|svg))/gi;
    const matches = content.match(urlRegex);
    
    if (matches && matches.length > 0) {
      try {
        // Process each URL found in the content
        let processedContent = content;
        for (const imageUrl of matches) {
          // Clean the URL to remove any potential whitespace or special characters
          const cleanUrl = imageUrl.trim();
          try {
            const localPath = await downloadImage(cleanUrl);
            // Replace the original URL with the local path
            processedContent = processedContent.replace(imageUrl, localPath);
          } catch (error) {
            console.error(`Failed to download image ${cleanUrl}:`, error);
            // Keep the original URL if download fails
          }
        }
        return processedContent;
      } catch (error) {
        console.error('Error processing image URLs:', error);
        return content; // Return original content if processing fails
      }
    }
  } else if (Array.isArray(content)) {
    // Process arrays recursively
    const processedArray = await Promise.all(
      content.map(item => processImageUrls(item))
    );
    return processedArray;
  } else if (content && typeof content === 'object') {
    // Process objects recursively
    const processedObject: any = {};
    for (const [key, value] of Object.entries(content)) {
      processedObject[key] = await processImageUrls(value);
    }
    return processedObject;
  }
  
  return content;
};

// Custom tool handler that filters for meme generation and saves images
const callTools = async (state: typeof AgentModeAnnotation.State) => {
  const { messages } = state;
  const lastMessage = messages[messages.length - 1] as AIMessage;
  const outputMessages: ToolMessage[] = [];

  // Create a map of tools by name for easy lookup
  const toolsByName = Object.fromEntries(
    tools.map((tool) => [tool.name, tool]),
  );

  console.log("lastMessage.tool_calls", lastMessage.tool_calls);

  for (const toolCall of lastMessage.tool_calls || []) {
    try {
      const tool = toolsByName[toolCall.name];
      if (!tool) {
        throw new Error(`Tool ${toolCall.name} not found`);
      }

      // Check if this is the specific meme generation tool
      const isMemeGenerationTool =
        toolCall.name ===
        "mcp__hf-mcp-server__gr3_agents_mcp_hackathon_meme_context_protocol";

      // Invoke the tool
      const toolResult = await tool.invoke(toolCall.args);
      console.log("toolResult", toolResult);

      let processedContent = toolResult;

      // If it's a meme generation tool, return only the text content from the second item
      if (isMemeGenerationTool) {
        if (Array.isArray(toolResult) && toolResult.length >= 2) {
          const secondItem = toolResult[1];
          // Extract just the text content, not the whole object
          if (secondItem && secondItem.text) {
            processedContent = secondItem.text;
          }
        }
      }

      // Process any image URLs in the content and download them
      processedContent = await processImageUrls(processedContent);

      outputMessages.push(
        new ToolMessage({
          content: processedContent,
          name: toolCall.name,
          tool_call_id: toolCall.id!,
        }),
      );
    } catch (error: any) {
      // Return the error if the tool call fails
      outputMessages.push(
        new ToolMessage({
          content: error.message,
          name: toolCall.name,
          tool_call_id: toolCall.id!,
          additional_kwargs: { error },
        }),
      );
    }
  }

  return { messages: outputMessages };
};

const shouldContinue = (state: typeof AgentModeAnnotation.State): string => {
  const { messages } = state;
  const lastMessage = messages[messages.length - 1];
  if (
    lastMessage._getType() === "ai" &&
    (lastMessage as AIMessage)?.tool_calls?.length
  ) {
    return "tools";
  }
  return "__end__";
};

const workflow = new StateGraph(AgentModeAnnotation)

  .addNode(
    "callModel",
    async (
      state: typeof AgentModeAnnotation.State,
      config: LangGraphRunnableConfig,
    ): Promise<typeof AgentModeAnnotation.Update> => {
      // Get rules from configuration and generate system prompt
      const rulesList = config.configurable?.rulesList || [];
      const systemPrompt = generateSystemPrompt(rulesList);

      const llm = new ChatOpenAI({
        modelName: "anthropic/claude-3-7-sonnet",
        openAIApiKey: process.env.OPENROUTER_API_KEY,
        temperature: 0,
        configuration: {
          baseURL: "https://openrouter.ai/api/v1",
          defaultHeaders: {
            "X-Title": "Computer: Content Creator",
          },
        },
      });

      const model = llm.bindTools(tools);
      const messagesWithSystemPrompt = [
        {
          role: "system" as const,
          content: systemPrompt,
        },
        ...state.messages,
      ];
      const response = await model.invoke(messagesWithSystemPrompt);
      return { messages: [response] };
    },
  )
  .addNode("tools", callTools)
  .addEdge(START, "callModel")
  .addEdge("tools", "callModel")
  .addConditionalEdges("callModel", shouldContinue, {
    tools: "tools",
    __end__: END,
  });

export const graph = workflow.compile();
graph.name = "Agent Mode Graph";
