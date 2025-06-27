import { parseAsString } from "nuqs";
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

        // Fetch user's custom TopSeen rules
        const userId = 'default-user'; // Replace with actual user ID from auth
        const rulesResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/topseen-rules?userId=${userId}`);
        let customRules = [];
        
        if (rulesResponse.ok) {
            const rulesData = await rulesResponse.json();
            customRules = rulesData.rules.filter(rule => rule.isActive);
        }

        // Fetch user credentials
        const instagramUsername = process.env.INSTAGRAM_USERNAME || "";
        const instagramPassword = process.env.INSTAGRAM_PASSWORD || "";

        // Validate that we have credentials
        if (!instagramUsername || !instagramPassword) {
            return new Response(JSON.stringify({ error: "Instagram credentials not configured. Please add your credentials in Account Settings." }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

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
                    instagramUsername,
                    "--password",
                    instagramPassword,
                ],
                env: {
                    RECEIVER_USERNAME: "mohamed.sobhy.2002",
                    INSTAGRAM_USERNAME: "babai.official.ai",
                    INSTAGRAM_PASSWORD: "ig_PapAi_Q2659Z"
                },
                // stderr: "ignore",
            }),
            // onUncaughtError: (error) => {
            //     console.log("Uncaught error:", JSON.stringify(error, null, 2));
            // },
        });

        const mcp_tools = await mcpClient.tools();

        // const allowed_tools = ["instagram_account_discovery", "message_crafting", "relationship_management", "automation_strategy"];

        // console.log("MCP Tools:", JSON.stringify(mcp_tools, null, 2));

        // Use the gateway model with type assertion for AI SDK 5 Beta compatibility
        // const model = gateway("anthropic/claude-4-sonnet") as any;
        const model = anthropic("claude-4-sonnet-20250514");

        console.log(`Messages: ${JSON.stringify(convertToModelMessages(messages), null, 2)}`);

        // Build custom rules section for system prompt
        let customRulesSection = '';
        if (customRules.length > 0) {
            customRulesSection = `

## Custom User Rules

The user has defined the following custom rules that you MUST follow in all interactions:

${customRules.map((rule, index) => `${index + 1}. **${rule.name}**: ${rule.description}`).join('\n')}

These rules take priority and should be applied to all your responses.
`;
        }

        const result = streamText({
            model,
            system: `You are TopSeen AI, an intelligent assistant for Instagram DM automation and influencer outreach. Your primary role is to help users discover, connect with, and manage relationships with Instagram influencers, creators, and businesses.${customRulesSection}

You are having a conversation with the following user: ${process.env.RECEIVER_USERNAME}

## Available Instagram Automation Tools

### 📨 Direct Messaging
- **send_message**: Send text messages to Instagram users by username
- **send_photo_message**: Send photos via DM with optional captions
- **send_video_message**: Send videos via DM to users

### 💬 Chat & Thread Management
- **list_chats**: Retrieve DM threads with filtering (flagged, unread) and message limits
- **list_messages**: Get messages from specific threads with customizable amounts
- **mark_message_seen**: Mark messages as read in conversations
- **list_pending_chats**: View pending message requests in your inbox
- **search_threads**: Search through DM threads by username or keywords
- **get_thread_by_participants**: Find conversations with specific users
- **get_thread_details**: Get comprehensive thread information and message history

### 👤 User Discovery & Information
- **search_users**: Find Instagram users by name or username with detailed profiles
- **get_user_info**: Get comprehensive user data (bio, follower count, verification status, etc.)
- **get_user_id_from_username** / **get_username_from_user_id**: Convert between usernames and IDs
- **check_user_online_status**: Check if users are currently online

### 📱 Social Intelligence
- **get_user_stories**: Access user's current Instagram stories
- **get_user_posts**: Retrieve recent posts with engagement metrics
- **get_user_followers**: Get follower lists with profile information
- **get_user_following**: See who users are following
- **like_media**: Like or unlike posts from URLs

## Core Capabilities

1. **Intelligent User Research**: Use search and profile tools to find and analyze potential collaborators
2. **Conversation Management**: Monitor, organize, and respond to DM threads efficiently
3. **Personalized Outreach**: Craft messages based on user's content, stories, and profile information
4. **Relationship Tracking**: Keep track of ongoing conversations and follow-ups
5. **Content Intelligence**: Analyze posts and stories to create relevant, contextual messages

## Message Crafting Guidelines

**Tone Options:**
- **Professional**: Business-focused, respectful, formal
- **Friendly**: Warm, approachable, conversational
- **Creative**: Artistic, unique, inspiring
- **Data-Driven**: Metrics-focused, analytical, results-oriented

**Best Practices:**
- Research users before messaging (check posts, stories, bio, follower count)
- Personalize based on recent content and interests
- Provide clear value propositions
- Respect Instagram's community guidelines
- Build authentic relationships over transactional interactions
- Use appropriate timing based on user activity and online status

## Workflow Examples

**Discovery → Research → Outreach:**
1. Search for users in target niche
2. Analyze their profile, posts, and engagement
3. Check if they're online for optimal timing
4. Craft personalized message based on research
5. Send message and track in conversation threads
6. Follow up appropriately based on response patterns

**Conversation Management:**
1. Review pending message requests
2. Check existing threads for new messages
3. Mark important messages as seen
4. Organize follow-ups based on conversation status

Always prioritize building genuine connections and providing real value to potential collaborators. Use the available tools strategically to create meaningful, personalized outreach campaigns.`,
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
            onStepFinish: async (step) => {
                console.log("Step finished:", JSON.stringify(step, null, 2));
            },
            onFinish: async () => {
                await mcpClient.close();
            },
            // onError: async (error) => {
            //     console.error("Error-1:", JSON.stringify(error, null, 2));
            //     await mcpClient.close();
            // }
        });

        console.log("Result:", JSON.stringify(await result, null, 2));

        // // typed tool results for tools with execute method:
        // for (const toolResult of await result.toolResults) {
        //     console.log("Tool result:", JSON.stringify(toolResult, null, 2));
        // }

        return result.toUIMessageStreamResponse();
    } catch (error) {
        console.error("Instagram Chat API error:", error);
        return new Response("Internal server error", { status: 500 });
    }
}
