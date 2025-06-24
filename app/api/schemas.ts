import { z } from "zod";

const locationSchema = z.object({
  name: z.string().describe("Name of the location").optional(),
  address: z.string().optional().describe("Address of the location"),
});

export const itineraryItemSchema = z.object({
  id: z.string().optional(),
  tripId: z.string().optional(),
  tripName: z.string().optional(),
  title: z.string(),
  description: z.string(),
  location: locationSchema.optional(),
  mapLink: z.string().url().optional(),
  status: z.enum(["not done", "in progress", "done"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  notes: z.string().optional(),
  dueDate: z.string().optional(),
  reminderEnabled: z.boolean().optional(),
  category: z.enum([
    "Drive",
    "Flight",
    "Stay",
    "Activity",
    "Meal",
    "Other",
    "Travel",
    "Event",
    "Accommodation",
    "Site",
    "Hike",
    "Other",
  ]),
  day: z.string().optional(),
  timeOfDay: z.enum(["morning", "afternoon", "evening", "night", "all day"]),
  estimatedTime: z.string().optional(),
  startDateTime: z
    .union([z.string(), z.date()])
    .describe("ISO date-time string for event timing")
    .optional(),
  sequence: z
    .union([z.string(), z.number()])
    .describe("Numerical order for sorting within the same startDateTime")
    .optional(),
});

export const preferencesSchema = z.object({
  adventureLevel: z
    .enum(["low", "medium", "high"])
    .describe("User preferred level of adventure"),
  prefersOutdoors: z.enum(["true", "false"]),
});

export type Preferences = z.infer<typeof preferencesSchema>;

export const updateItineraryInputSchema = z.object({
  existingItinerary: z
    .array(itineraryItemSchema)
    .describe("Current array of itinerary items"),
  userInput: z.string().describe("User's new text input"),
  preferences: preferencesSchema,
  tripId: z.string(),
  tripName: z.string(),
});

export const createItineraryInputSchema = z.object({
  userInput: z.string().describe("User's text input"),
  tripId: z.string(),
  tripName: z.string(),
  preferences: preferencesSchema,
  startDate: z.string(),
});

export const travelItineraryResponseSchema = z.object({
  newItinerary: z
    .array(itineraryItemSchema)
    .describe("Array of updated itinerary items")
    .min(2),
});

// const newItineraryItemSchema = z.object({
//   title: z
//     .string()
//     .describe(
//       "Title of the itinerary item. example: Explore Þingvellir National Park"
//     ),
//   description: z
//     .string()
//     .describe(
//       "Description of the itinerary item. example: Discover Þingvellir National Park, a site of geological wonders and historical significance."
//     ),
//   location: locationSchema,
//   notes: z
//     .string()
//     .optional()
//     .describe(
//       "Detailed additional notes that build on the description. Include tips, tricks, or important reminders like reservation details here."
//     ),
//   mapLink: z
//     .string()
//     .describe(
//       'Google maps search api url. Always format as "mapLink: "https://www.google.com/maps/search/?api=1&query=<URL ENCODED location.name>"'
//     ),
//   dueDate: z.string().describe("Due date of the itinerary item"),
//   category: z
//     .enum([
//       "Drive",
//       "Flight",
//       "Stay",
//       "Activity",
//       "Event",
//       "Meal",
//       "Travel",
//       "Accommodation",
//       "Site",
//       "Hike",
//       "Other",
//     ])
//     .describe(
//       "Must be one of: Drive,Flight,Event,Stay,Activity,Meal,Accommodation,Site,Hike or Other if the category isn't here."
//     ),
//   day: z
//     .string()
//     .describe("Day of the trip for the itinerary item. example: day_1, day_2"),
//   timeOfDay: z.enum(["morning", "afternoon", "evening", "night", "all day"]),
//   estimatedTime: z
//     .string()
//     .describe("Estimated time to complete this itinerary item"),
// });
