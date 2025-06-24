import { useRxData } from "rxdb-hooks";
import { EmptyStateCard, SkeletonCard } from "./cards";
import { TripOverviewCard } from "./trip-overview-card";

export function TripOverviewList() {
  const { result: campaigns_v0, isFetching } = useRxData<{
    tripId: string;
    tripName: string;
  }>("trips_v0", (collection) => collection.find({}));

  if (campaigns_v0.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 lg:mx-auto lg:pt-24 gap-4 px-2">
        <EmptyStateCard />
      </div>
    );
  }

  if (isFetching) {
    return <SkeletonCard />;
  }

  return (
    <div className="px-2">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-2">
        {campaigns_v0.map((campaign) => (
          <div key={campaign.tripId}>
            <TripOverviewCard 
              tripId={campaign.tripId} 
              tripName={campaign.tripName} 
            />
          </div>
        ))}
      </div>
    </div>
  );
}
