"use client";
import { useRxCollection } from "rxdb-hooks";
import { toast } from "sonner";
import { ItineraryList } from "@/db/model";
import qs from "qs";

export function useShareItinerary() {
  const todosCollection = useRxCollection<ItineraryList>("trip_itinerary_v0");

  const shareItinerary = async (tripId: string) => {
    try {
      if (!todosCollection) {
        toast.error("trip not found");
        console.error("trip collection not found");
        return;
      }

      const itineraryItems = await todosCollection
        .find({ selector: { tripId: tripId } })
        .exec();

      if (!itineraryItems.length) {
        toast.error("No itinerary items found for the given trip");
        console.error("No itinerary items found for the given trip");
        return;
      }

      // Serialize the itinerary data to a query string
      // Ensure that the serialization is safe and privacy-conscious
      const serializedData = qs.stringify({
        items: itineraryItems.map((item) => item.toJSON()),
      });
      const shareUrl = `${
        window.location.origin
      }/share?state=${encodeURIComponent(serializedData)}`;

      // Logic to copy the URL to the clipboard
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => toast.success("Itinerary link copied to clipboard!"))
        .catch((error) => {
          toast.error("Failed to copy itinerary link:", error);
          console.error("Failed to copy itinerary link:", error);
        });

      console.log("Itinerary link:", shareUrl);
    } catch (error) {
      toast.error(`Error sharing itinerary: ${error.message}`);
      console.error("Error sharing itinerary:", error);
    }
  };

  return shareItinerary;
}
