import { NextRequest, NextResponse } from "next/server";

import { anthropic as _anthropic } from "@ai-sdk/anthropic";
import { ZodFunctionDef } from "openai-zod-functions";
import { nanoid } from "nanoid";
import { travelItineraryResponseSchema, updateItineraryInputSchema } from "../schemas";
import { getModelOutput } from "../ai-json-completion";
import { extendItinerarySystemPrompt, extendItineraryUserPrompt } from "../prompts";

export const runtime = "edge";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const validation = updateItineraryInputSchema.safeParse(body);
    if (validation.success === false) {
        console.error(validation.error);
        console.error(validation.error.issues);
        console.error(body);
        return errorResponse("Invalid request body", 400);
    }

    const { existingItinerary, userInput, preferences, tripId, tripName } = validation.data;

    const system = extendItinerarySystemPrompt();
    const userPrompt = extendItineraryUserPrompt(existingItinerary, preferences, userInput);

    const functions: ZodFunctionDef[] = [
        {
            name: "update_travel_itinerary",
            description: "Updates an existing travel itinerary based on user input and preferences",
            schema: travelItineraryResponseSchema,
        },
    ];
    const modelOutput = await getModelOutput(system, userPrompt, functions);

    if (!modelOutput) {
        return errorResponse("Failed to update travel itinerary due to AI model failure.", 500);
    }

    const newItinerary = normalizeNewItinerary(modelOutput.newItinerary, tripId, tripName);

    return NextResponse.json(
        {
            success: true,
            itinerary: newItinerary,
            fullItinerary: [...existingItinerary, ...newItinerary],
        },
        { status: 200 }
    );
}

// Normalizes the format of new itinerary items, ensuring consistent data structure
function normalizeNewItinerary(newItinerary: any[], tripId: string, tripName: string): any[] {
    return newItinerary.map((item, index) => ({
        ...item,
        id: `order_${index}_id_${nanoid()}`,
        status: "not done",
        priority: "medium",
        tripId: tripId,
        tripName: tripName,
        startDateTime: item.startDateTime || new Date().toISOString(),
        sequence: item.sequence || 0,
    }));
}

// Returns a standardized error response for HTTP errors
function errorResponse(message: string, status: number): NextResponse {
    return NextResponse.json({ success: false, message }, { status });
}
