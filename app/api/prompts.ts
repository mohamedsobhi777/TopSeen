import { trim } from "llm-message-utils";
import { Preferences } from "./schemas";

// This function returns a system prompt for extending an itinerary with precise instructions for the AI.
export function extendItinerarySystemPrompt(): string {
  return trim`
    You are a master travel guide bot designed to help travelers extend their current itinerary.
    - Ensure that your new suggestions are achievable.
    - If your suggestion requires travel (e.g., long drive, train, or flight), break it into a separate item.
    - Based on this information, suggest a full new day of itinerary items.
    - Only output JSON.
  `;
}

// Generates a user prompt for extending an itinerary using dynamic inputs and user preferences.
export function extendItineraryUserPrompt(
  itinerary: any[], // Consider defining a more specific type or interface for itinerary items.
  preferences: Preferences,
  userInput: string
): string {
  return trim`
    <current_itinerary>${JSON.stringify(
      itinerary.slice(-4)
    )}</current_itinerary>
    <adventure_level>${preferences.adventureLevel}</adventure_level>
    <travel_goals>${userInput}</travel_goals>
  `;
}

// Example itinerary items used as few-shot examples to guide the AI in generating new items.
const fewShotExamples = trim`[
  {
    title: "Hverir 10/10 Hot Springs",
    description: "Best Hot springs experience in Iceland IMO. Go very early in the morning or at dusk to avoid crowds.",
    location: { name: "Hverir Hot Springs" },
    mapLink: "https://www.google.com/maps/search/?api=1&query=Hverir%20Hot%20Springs",
    notes: "Go very early in the morning or at dusk to avoid crowds. Seriously amazing experience",
    dueDate: "2025-04-09",
    category: "Hike",
    day: "day_1",
    timeOfDay: "evening",
    estimatedTime: "4 hours",
  },
  {
    title: "Hverir Camping",
    description: "Quiet campground 10 minutes from hot springs.",
    location: { name: "Reykjamörk Hveragerði Campsite" },
    mapLink: "https://www.google.com/maps/search/?api=1&query=Reykjamörk%20Hveragerði%20Campsite",
    notes: "Explore the varied landscapes of Heiðmörk, with its woodland areas, volcanic formations, and numerous trails. Perfect for a relaxed day of hiking and bird watching.",
    dueDate: "2025-05-09",
    category: "Accommodation",
    day: "day_2",
    timeOfDay: "night",
    estimatedTime: "8 hours",
  },
  {...More items},
]`;

// This function returns a system prompt for creating new itinerary suggestions based on user input and few-shot examples.
export function createItinerarySystemPrompt(): string {
  return `You are a helpful assistant that suggests travel itineraries based on user input. Here is a sample itinerary: <example> ${fewShotExamples} </example>. Now provide an array of awesome itinerary items.`;
}

// Generates a user prompt for creating an itinerary based on user input and preferences, describing the desired adventure and activity type.
export function createItineraryUserPrompt(
  userInput: string,
  preferences: Preferences,
  startDate: any
): string {
  const adventureLevelDesc = getAdventureLevelDescription(
    preferences.adventureLevel
  );
  const activityTypeDesc = getActivityTypeDescription(preferences);
  return `Create a well thought, unique travel itinerary starting on ${startDate} based on the user's input: ${userInput}`;
}

// Helper function to determine the descriptive string based on adventure level.
function getAdventureLevelDescription(level: string): string {
  switch (level) {
    case "high":
      return "high-intensity";
    case "medium":
      return "balanced";
    case "low":
      return "relaxed";
    default:
      return "unspecified";
  }
}

// Helper function to determine the descriptive string based on activity preference.
function getActivityTypeDescription(preferences: Preferences): string {
  return preferences.prefersOutdoors ? "outdoor" : "indoor";
}
