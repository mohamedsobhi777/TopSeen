"use client";
import { useRxCollection } from "rxdb-hooks";
import { toast } from "sonner";
import { ChecklistItem } from "@/db/model";

export function useDeleteListItem() {
  const collection = useRxCollection<ChecklistItem>("trip_itinerary_v0");

  const deleteListItem = async (id: string) => {
    try {
      if (collection) {
        const document = await collection.findOne({
          selector: { id },
        });

        if (document) {
          await document.remove();
          toast.success("List Item deleted successfully");
          console.log("List Item deleted successfully");
        } else {
          toast.error("List Item not found");
          console.log("List Item not found");
        }
      } else {
        toast.error("Collection not found");
        console.log("Collection not found");
      }
    } catch (error) {
      toast.error("Error deleting list item:", error);
      console.error("Error deleting list item:", error);
      // Handle the error appropriately (e.g., show an error message to the user)
    }
  };

  return deleteListItem;
}
