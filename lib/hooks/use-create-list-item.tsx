"use client";

import { useRxCollection } from "rxdb-hooks";
import { toast } from "sonner";
// import { TodoFormValues } from "./TodoForm"; // Assuming you have exported the TodoFormValues type from the TodoForm file
import { ChecklistItem } from "@/db/model";

export function useCreateListItem() {
  const collection = useRxCollection<ChecklistItem>("trip_itinerary_v0");

  const createTodo = async (data: any) => {
    try {
      if (collection) {
        const newTodo: ChecklistItem = {
          ...data,
          //   id: generateId(), // Generate a unique ID for the new todo
          createdAt: new Date().toISOString(), // Set the creation date
          location: {
            name: data.locationName,
            address: data.address,
          },
        };

        await collection.insert(newTodo);
        toast.success("Todo created successfully");
        console.log("Todo created successfully");
      } else {
        toast.error("Collection not found");
        console.log("Collection not found");
      }
    } catch (error) {
      toast.error("Error creating todo:", error);
      console.error("Error creating todo:", error);
      // Handle the error appropriately (e.g., show an error message to the user)
    }
  };

  return createTodo;
}
