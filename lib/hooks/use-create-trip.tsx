import { useRouter } from "next/navigation";
import { useRxCollection } from "rxdb-hooks";
import { toast } from "sonner"; // Assuming this is a toast notification library

export interface TripFormValues {
  tripId: string;
  tripName: string;
}

export function useCreateTrip() {
  const collection = useRxCollection<TripFormValues>("trips_v0");
  const router = useRouter();

  const createTrip = async (data: TripFormValues) => {
    try {
      if (collection) {
        // Prepare the trip data, assuming `tripId` is pre-generated and passed in `data`
        const newTrip: TripFormValues = {
          tripId: data.tripId, // Using provided tripId, ensure it's unique
          tripName: data.tripName,
        };

        await collection.insert(newTrip);
        toast.success("Trip created successfully");
        router.push(`/${data.tripId}`);
        console.log("Trip created successfully");
      } else {
        toast.error("Collection not found");
        console.log("Collection not found");
      }
    } catch (error) {
      toast.error(`Error creating trip: ${error.message}`);
      console.error("Error creating trip:", error);
    }
  };

  return createTrip;
}
