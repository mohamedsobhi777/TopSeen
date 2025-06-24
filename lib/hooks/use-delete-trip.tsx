"use client";

import { ChecklistItem, ItineraryList } from "@/db/model";
import { useRxCollection } from "rxdb-hooks";
import { toast } from "sonner";

export function useDeleteTrip() {
  const tripsCollection = useRxCollection<ChecklistItem>("trips_v0");
  const todosCollection = useRxCollection<ItineraryList>("trip_itinerary_v0");

  const handleDeleteTrip = async (tripId: string) => {
    try {
      // First, find and delete all related todos
      const relatedTodos = await todosCollection
        .find({ selector: { tripId: tripId } })
        .exec();
      await Promise.all(relatedTodos.map((todo) => todo.remove()));
      // toast.success("All related todos deleted successfully");

      // Then, find and delete the trip
      const tripDoc = await tripsCollection
        .findOne({ selector: { tripId: tripId } })
        .exec();
      if (!tripDoc) {
        throw new Error("Trip not found");
      }
      await tripDoc.remove();
      toast.success("Trip deleted successfully");
    } catch (error) {
      toast.error(`Error deleting trip and related todos: ${error.message}`);
      console.error("Error deleting trip and related todos:", error);
    }
  };

  return handleDeleteTrip;
}
