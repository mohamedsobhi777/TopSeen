"use client";

import { ChecklistItem } from "@/db/model";
import { useRxCollection } from "rxdb-hooks";
import { toast } from "sonner";

interface UpdateStatusArgs {
  id: string;
  status: "done" | "not done" | "later";
}

export function useUpdateListItemStatus() {
  const collection = useRxCollection<ChecklistItem>("trip_itinerary_v0");

  const updateStatus = async ({ id, status }: UpdateStatusArgs) => {
    try {
      if (collection) {
        const document = await collection.findOne({
          selector: {
            id: id,
          },
        });

        if (document) {
          await document.update({
            $set: {
              status: status,
            },
          });
          toast.success("ListItem status updated successfully");
          console.log("ListItem status updated successfully");
        } else {
          toast.error("ListItem not found");
          console.log("ListItem not found");
        }
      } else {
        toast.error("Collection not found");
        console.log("Collection not found");
      }
    } catch (error) {
      toast.error("Error updating list item status:", error);
      console.error("Error updating list item status:", error);
      // Handle the error appropriately (e.g., show an error message to the user)
    }
  };

  return updateStatus;
}
