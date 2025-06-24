import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { customAlphabet } from "nanoid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  7
); // 7-character random string

export function extractAndDecodeTripName(tripName) {
  // Check if "__TRIP_NAME__" is included in the tripName
  if (tripName.includes("__TRIP_NAME__")) {
    const parts = tripName.split("__TRIP_NAME__");
    const tripNamePart = parts[1]; // This will be the string after "__TRIP_NAME__"

    if (tripNamePart) {
      // Decode the URI component to handle spaces and other encoded characters
      return decodeURIComponent(tripNamePart);
    } else {
      // Handle the case where nothing follows "__TRIP_NAME__"
      console.warn("Trip name after '__TRIP_NAME__' is empty.");
      return ""; // Return an empty string or any default value you deem appropriate
    }
  } else {
    // If "__TRIP_NAME__" is not found, return the original tripName or handle differently
    console.warn("__TRIP_NAME__ not found in tripName.");
    return tripName; // Could also return a default trip name if preferred
  }
}
