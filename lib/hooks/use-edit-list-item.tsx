"use client";
import { useRxCollection } from "rxdb-hooks";
import { toast } from "sonner";
import { ChecklistItem } from "@/db/model";

export function useEditListItem() {
  const collection = useRxCollection<ChecklistItem>("trip_itinerary_v0");

  const edit = async (id: string, updatedData: Partial<ChecklistItem>) => {
    try {
      if (collection) {
        const document = await collection.findOne({
          selector: { id },
        });

        if (document) {
          await document.update({
            $set: updatedData,
          });
          toast.success("List Item updated successfully");
          console.log("List Item updated successfully");
        } else {
          toast.error("List Item not found");
          console.log("List Item not found");
        }
      } else {
        toast.error("Collection not found");
        console.log("Collection not found");
      }
    } catch (error) {
      toast.error("Error updating list item:", error);
      console.error("Error updating list item:", error);
      // Handle the error appropriately (e.g., show an error message to the user)
    }
  };

  return edit;
}
