import { NextRequest, NextResponse } from "next/server";
import { ZodFunctionDef } from "openai-zod-functions";
import { nanoid } from "nanoid";

import { getModelOutput } from "../ai-json-completion";
import {
  travelItineraryResponseSchema,
  createItineraryInputSchema,
} from "../schemas";
import {
  createItinerarySystemPrompt,
  createItineraryUserPrompt,
} from "../prompts";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = createItineraryInputSchema.safeParse(body);
  if (validation.success === false) {
    console.error(validation.error);
    return errorResponse("Invalid input", 400);
  }

  const { userInput, preferences, tripId, tripName, startDate } =
    validation.data;
  const systemPrompt = createItinerarySystemPrompt();
  const userPrompt = createItineraryUserPrompt(
    userInput,
    preferences,
    startDate
  );
  const functions: ZodFunctionDef[] = [
    {
      name: "generate_travel_itinerary",
      description: "Generates the first two days of a travel itinerary",
      schema: travelItineraryResponseSchema,
    },
  ];

  const modelOutput = await getModelOutput(systemPrompt, userPrompt, functions);
  if (!modelOutput || modelOutput.length === 0) {
    return errorResponse("Failed to generate travel itinerary", 500);
  }

  console.log(modelOutput);
  const updatedItinerary = normalizeItinerary(modelOutput, tripId, tripName);
  console.log(updatedItinerary);
  return successResponse(updatedItinerary);
}

// Normalizes the itinerary data format
function normalizeItinerary(modelOutput: any, tripId, tripName): any[] {
  return modelOutput?.newItinerary.map((item, index) => ({
    ...item,
    id: `order_${index}_id_${nanoid()}`,
    status: "not done",
    priority: "medium",
    tripId: tripId,
    tripName: tripName,
    startDateTime: item?.startDateTime || new Date().toISOString(),
    sequence: item?.sequence || 0,
  }));
}

// Helper function to create a standardized success JSON response
function successResponse(itinerary: any[]): NextResponse {
  return NextResponse.json(
    { success: true, itinerary: itinerary },
    { status: 200 }
  );
}

// Helper function to create a standardized error JSON response
function errorResponse(message: string, status: number): NextResponse {
  return NextResponse.json({ success: false, message }, { status });
}
