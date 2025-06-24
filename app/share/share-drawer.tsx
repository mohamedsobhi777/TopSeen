"use client";

import qs from "qs";
import { toast } from "sonner";
import { useRxCollection } from "rxdb-hooks";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChecklistItem } from "@/db/model";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";

import { TimelineView } from "@/components/forms/ai-timeline";

export interface TripFormValues {
  tripId: string;
  tripName: string;
}

export function ShareTripDrawer() {
  const searchParams = useSearchParams();

  const [itinerary, setItinerary] = useState(null);
  const router = useRouter();

  const todosCollection = useRxCollection<ChecklistItem[]>("trip_itinerary_v0");
  const tripsCollection = useRxCollection<TripFormValues>("trips_v0");

  useEffect(() => {
    const stateParam = searchParams.get("state");
    if (stateParam) {
      try {
        const parsedState = qs.parse(stateParam);
        // Ensure required fields are present
        if (!parsedState.items[0].id || !parsedState.items[0].tripId) {
          console.error("Deserialized data is missing 'id' or 'tripId'.");
          toast.error("Imported data is incomplete and cannot be processed.");
          return; // Stop further processing if data is incomplete
        }
        setItinerary(parsedState);
      } catch (error) {
        console.error("Error parsing shared itinerary:", error);
        toast.error("There was an error loading the shared itinerary.");
      }
    }
  }, [searchParams]);

  const importItinerary = async () => {
    console.log("importItinerary", itinerary);
    if (itinerary) {
      try {
        // Check or create trip
        let trip = await tripsCollection
          .findOne({ selector: { tripId: itinerary.items[0].tripId } })
          .exec();
        console.log("importItinerary", trip);
        if (!trip) {
          // Assuming tripId and tripName are available in the itinerary data
          trip = await tripsCollection.insert({
            tripId: itinerary.items[0].tripId,
            tripName: itinerary.items[0].tripName || "Unknown Trip Name", // Provide a default or fetch from user input
          });

          toast.success("Trip created successfully");
        }

        // Insert itinerary items
        await todosCollection.bulkInsert(
          itinerary.items.map((item) => ({
            ...item,
            tripId: trip.tripId, // Ensure all items are linked to the correct tripId
          }))
        );
        toast.success("Itinerary imported successfully");
        router.push("/"); // Redirect to the homepage
      } catch (error) {
        console.error("Error importing shared itinerary:", error);
        toast.error(`Failed to import itinerary: ${error.message}`);
      }
    }
  };
  return (
    <div>
      <Drawer open={true}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>Confirm Import</DrawerTitle>
              <DrawerDescription>
                Are you sure you want to import this itinerary?
              </DrawerDescription>
            </DrawerHeader>

            <div className="flex justify-between p-4">
              <Button onClick={importItinerary}>Save shared itinerary</Button>
            </div>
            <ScrollArea className="h-[calc(100vh-20rem)]">
              <TimelineView
                newItems={itinerary?.items}
                loadingStatus={itinerary?.items.length < 0}
              />
            </ScrollArea>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
