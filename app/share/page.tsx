import { Suspense } from "react";

import { ShareTripDrawer } from "./share-drawer";

export interface TripFormValues {
  tripId: string;
  tripName: string;
}

export default function SharePage() {
  return (
    <div>
      <Suspense fallback={null}>
        <ShareTripDrawer />
      </Suspense>
    </div>
  );
}
