"use client";

import { useRxCollection } from "rxdb-hooks";
import { toast } from "sonner";
import { ChecklistItem } from "@/db/model";

export function useMutateList() {
  const collection = useRxCollection<ChecklistItem>("trip_itinerary_v0");

  const mutateList = async (
    todos: Array<{ id: string; data: Partial<ChecklistItem> }>
  ) => {
    try {
      if (!collection) {
        throw new Error("Collection not found");
      }

      const updatePromises = todos?.map(async (todo) => {
        const doc = await collection
          .findOne({ selector: { id: todo.id } })
          .exec();

        if (doc) {
          return doc.update({
            $set: {
              ...todo,
              updatedAt: new Date().toISOString(),
            },
          });
        } else {
          // Make sure all required fields are included or have default values
          const newData = {
            ...todo,
            createdAt: new Date().toISOString(),
          };

          // Optional: Validate newData here or ensure defaults are set
          // @ts-ignore
          return collection.insert(newData);
        }
      });

      await Promise.all(updatePromises);
      toast.success("Todos updated successfully");
    } catch (error) {
      toast.error(`Error updating todos: ${error.message || error.toString()}`);
      console.error("Error updating todos:", error.message);
    }
  };

  return mutateList;
}
