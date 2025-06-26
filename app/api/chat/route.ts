import { anthropic } from "@ai-sdk/anthropic";
import { gateway } from "@vercel/ai-sdk-gateway";
import { convertToModelMessages, experimental_createMCPClient, streamText } from "ai";
import { Experimental_StdioMCPTransport as StdioMCPTransport } from "ai/mcp-stdio";
import { env } from "process";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    try {
        console.log("Instagram Chat API called");

        const { messages } = await req.json();

        console.log("Messages received:", messages?.length || 0);

        const mcpClient = await experimental_createMCPClient({
            transport: new StdioMCPTransport({
                command: "uv",
                args: [
                    "run",
                    "--directory",
                    "/Users/mohamedmorsi/Business/TopSeen/instagram_dm_mcp",
                    "python",
                    "src/mcp_server.py",
                    "--username",
                    process.env.INSTAGRAM_USERNAME || "",
                    "--password",
                    process.env.INSTAGRAM_PASSWORD || "",
                ],
            }),
        });

        const mcp_tools = await mcpClient.tools();

        // const allowed_tools = ["instagram_account_discovery", "message_crafting", "relationship_management", "automation_strategy"];

        // console.log("MCP Tools:", JSON.stringify(mcp_tools, null, 2));

        // Use the gateway model with type assertion for AI SDK 5 Beta compatibility
        // const model = gateway("anthropic/claude-4-sonnet") as any;
        const model = anthropic("claude-4-sonnet-20250514");

        console.log(`Messages: ${JSON.stringify(convertToModelMessages(messages), null, 2)}`);

        const result = streamText({
            model,
            system: `You are TopSeen AI, an intelligent assistant for Instagram DM automation and influencer outreach. Your primary role is to help users discover, connect with, and manage relationships with Instagram influencers, creators, and businesses.

You are having a conversation with the following user: ${process.env.RECEIVER_USERNAME}
        
Your capabilities include:
1. **Instagram Account Discovery**: Help users find relevant Instagram accounts based on their criteria (niche, follower count, engagement, location, etc.)
2. **Message Crafting**: Create personalized, effective DM messages for different purposes:
   - Initial outreach and introductions
   - Collaboration proposals
   - Follow-up messages
   - Thank you notes
   - Campaign invitations
3. **Relationship Management**: Provide insights on managing influencer relationships and campaign tracking
4. **Automation Strategy**: Suggest best practices for Instagram DM automation while maintaining authenticity

Mood/Tone Options:
- **Professional**: Formal, business-appropriate, respectful
- **Friendly**: Warm, casual, approachable
- **Flirty**: Playful, charming, subtly romantic (use appropriately)
- **Nerdy**: Technical, detailed, enthusiastic about expertise
- **Witty**: Humorous, clever, entertaining

Guidelines:
- Always prioritize authentic, value-driven communication over pushy sales tactics
- Respect Instagram's terms of service and avoid spam-like behavior
- Suggest personalization based on the recipient's content and interests
- Provide alternative message options and A/B testing suggestions
- Consider timing, frequency, and relationship building in your recommendations
- Help users build genuine connections that lead to long-term partnerships

When users ask about sending messages:
1. Craft the message based on their requirements
2. Explain why the approach will be effective
3. Provide alternative options if relevant
4. Suggest the best timing and follow-up strategy

Example interactions:
- "Draft a friendly message to @fashionista_emily about collaboration"
- "Create a professional outreach message for tech influencers" 
- "Help me follow up with @lifestyle_sarah about our previous conversation"

Always provide actionable, specific advice for Instagram outreach and relationship building.`,
            // messages: convertToModelMessages(messages).map((msg, idx, arr) => {
            //     if (idx === arr.length - 1) {
            //         return {
            //             ...msg,
            //             providerOptions: {
            //                 anthropic: { cacheControl: { type: "ephemeral" } },
            //             },
            //         };
            //     }
            //     return msg;
            // }),
            messages: convertToModelMessages(messages),
            tools: mcp_tools,
            onFinish: async () => {
                await mcpClient.close();
            },
            onError: async (error) => {
                console.error("Error:", error);
                await mcpClient.close();
            }
        });

        return result.toUIMessageStreamResponse();
    } catch (error) {
        console.error("Instagram Chat API error:", error);
        return new Response("Internal server error", { status: 500 });
    }
}
