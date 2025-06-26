import { createUIMessageStream, createUIMessageStreamResponse } from "ai";
import { SearchState } from "./types";
import { instagramSearch } from "./main";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query || typeof query !== 'string') {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Query is required and must be a string"
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const stream = createUIMessageStream({
      execute: async ({ writer }) => {
        const searchState: SearchState = {
          query: query.trim(),
          completedSteps: 0,
          tokenUsed: 0,
          accounts: [],
          processedUrls: new Set(),
        };

        // Create a mock dataStream object for backward compatibility
        const dataStream = {
          writeData: (data: any) => {
            console.log('Streaming data:', data.type, data.content ? Object.keys(data.content) : 'no content');
            writer.write({
              type: 'data-custom',
              data: data
            });
          }
        };

        await instagramSearch(searchState, dataStream);
      },
    });

    return createUIMessageStreamResponse({ stream });
  } catch (error) {
    console.error("Instagram search error:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred"
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 