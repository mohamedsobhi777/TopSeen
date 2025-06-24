import { gateway } from "@vercel/ai-sdk-gateway"
import { convertToModelMessages, streamText } from "ai"
import { z } from "zod"

import { advancedFilterSearch } from "./advancedFilterSearch"
import { fuzzySearch } from "./fuzzySearch"
import { hybridSearch } from "./hybridSearch"
import { semanticSearch } from "./semanticSearch"
import { simpleNameSearch } from "./simpleNameSearch"

// Simplified schema for AI SDK 5 alpha compatibility
const filtersSchema = z.object({
  city: z.string().describe("City or location"),
  gender: z.string().describe("Gender (male, female, non-binary, etc.)"),
  tags: z
    .array(z.string())
    .describe("Tags or specialties (ai, fintech, climate, etc.)"),
      nationality: z.string().describe("Nationality"),
  age: z.string().describe("Age range"),
  industry: z.string().describe("Industry or sector"),
})

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  try {
    console.log("Chat API called")

    const { messages } = await req.json()
    console.log("Messages received:", messages?.length || 0)

    console.log("Starting streamText with Vercel AI Gateway")
    const result = streamText({
      model: gateway("anthropic/claude-4-sonnet-20250514"),
      system: (() => {
        // Configuration for which tools to enable in the system prompt
        const enabledTools = {
          simpleNameSearch: true,
          semanticSearch: false,
          hybridSearch: false,
          fuzzySearch: false,
          advancedFilterSearch: false,
        }

        // Base system prompt
        let systemPrompt = `You are a helpful assistant for a founder discovery platform. You help users find and connect with startup founders based on their criteria.

Your primary role is to:
1. Understand what type of search the user wants to perform
2. Choose the appropriate search tool based on the query type
3. Present founders in a helpful and organized way
4. Provide insights about the search results

Available search tools:`

        // Conditionally add tool descriptions based on configuration
        if (enabledTools.simpleNameSearch) {
          systemPrompt += `\n- **simpleNameSearch**: For finding founders by name (e.g., "find Maria", "show me John Smith")`
        }
        if (enabledTools.semanticSearch) {
          systemPrompt += `\n- **semanticSearch**: For conceptual queries (e.g., "AI founders", "climate tech entrepreneurs")`
        }
        if (enabledTools.hybridSearch) {
          systemPrompt += `\n- **hybridSearch**: For combining semantic understanding with specific filters`
        }
        if (enabledTools.fuzzySearch) {
          systemPrompt += `\n- **fuzzySearch**: For handling typos and partial matches`
        }
        if (enabledTools.advancedFilterSearch) {
          systemPrompt += `\n- **advancedFilterSearch**: For specific criteria combinations`
        }

        systemPrompt += `\n\nChoose the most appropriate tool based on the user's query:`

        // Conditionally add usage guidance based on configuration
        if (enabledTools.simpleNameSearch) {
          systemPrompt += `\n- Use simpleNameSearch for name-based queries`
        }
        if (enabledTools.semanticSearch) {
          systemPrompt += `\n- Use semanticSearch for industry/concept queries without specific filters`
        }
        if (enabledTools.hybridSearch) {
          systemPrompt += `\n- Use hybridSearch when combining concepts with location, gender, or other filters`
        }
        if (enabledTools.fuzzySearch) {
          systemPrompt += `\n- Use fuzzySearch when you detect potential typos or need partial matching`
        }
        if (enabledTools.advancedFilterSearch) {
          systemPrompt += `\n- Use advancedFilterSearch for complex filter combinations`
        }

        systemPrompt += `\n\nIf no relevant founders are found, suggest alternative search criteria or ask clarifying questions.`

        return systemPrompt
      })(),
      messages: convertToModelMessages(messages),
      tools: {
        simpleNameSearch: simpleNameSearch,
        // semanticSearch: semanticSearch,
        hybridSearch: hybridSearch,
        // fuzzySearch: fuzzySearch,
        // advancedFilterSearch: advancedFilterSearch,
      },
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error("Chat API error:", error)
    return new Response("Internal server error", { status: 500 })
  }
}
