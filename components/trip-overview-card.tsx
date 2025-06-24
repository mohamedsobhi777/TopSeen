import Link from "next/link";
import { useRxData } from "rxdb-hooks";
import { format, differenceInCalendarDays } from "date-fns";
import {
  CalendarIcon,
  Tag,
  FolderOpenIcon,
  TrashIcon,
  CheckCircleIcon,
  ClockIcon,
  SendIcon,
  InstagramIcon,
  UsersIcon,
  MessageCircleIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

import TextureCard, {
  TextureCardContent,
  TextureCardDescription,
  TextureCardFooter,
  TextureCardHeader,
  TextureCardTitle,
  TextureSeparator,
} from "@/components/cult/texture-card";

import { InstagramAccount } from "@/db/model";
import { extractAndDecodeTripName } from "@/lib/utils";

import { useDeleteTrip } from "@/lib/hooks/use-delete-trip";
import { useShareItinerary } from "@/lib/hooks/use-share-itinerary";
import { EmojiBadgeList } from "./cards";

export function TripOverviewCard({
  tripId,
  tripName,
}: {
  tripId: string;
  tripName: string;
}) {
  const handleDeleteTrip = useDeleteTrip();
  const handleShareTrip = useShareItinerary();
  const { result: accounts, isFetching: isFetchingAccounts } =
    useRxData<InstagramAccount>("instagram_accounts_v0", (collection) =>
      collection.find({
        selector: { profileId: tripId },
      })
    );

  // Calculate campaign metrics
  const categories = Array.from(
    new Set(accounts.map((account) => account.category))
  ).sort();
  
  const createdDate = accounts.reduce(
    (min, account) => (account.createdAt < min ? account.createdAt : min),
    accounts[0]?.createdAt
  );
  
  const lastUpdated = accounts.reduce(
    (max, account) => (account.updatedAt > max ? account.updatedAt : max),
    accounts[0]?.updatedAt
  );

  // Calculate the number of contacted accounts
  const contactedAccounts = accounts.filter(
    (account) => account.status === "contacted" || account.status === "responded"
  ).length;
  const totalAccounts = accounts.length;
  const contactPercentage =
    totalAccounts > 0 ? (contactedAccounts / totalAccounts) * 100 : 0;

  // Calculate response rate
  const respondedAccounts = accounts.filter(
    (account) => account.status === "responded"
  ).length;
  const responseRate = contactedAccounts > 0 ? (respondedAccounts / contactedAccounts) * 100 : 0;

  function deleteTrip() {
    console.log("Campaign deleted:", tripId);
  }

  if (isFetchingAccounts) {
    return <Skeleton />;
  }

  return (
    <TextureCard>
      <TextureCardHeader className="flex flex-col gap-1 items-center justify-center mb-4">
        <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-3">
          <InstagramIcon className="w-9 h-9 text-white stroke-1 fill-white/50" />
        </div>
        <TextureCardTitle className="text-2xl font-semibold">
          {extractAndDecodeTripName(tripName)}
        </TextureCardTitle>
        <TextureCardDescription className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
          <UsersIcon className="w-4 h-4 text-blue-500" />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {totalAccounts} accounts
          </span>
        </TextureCardDescription>
      </TextureCardHeader>
      <TextureSeparator />
      <TextureCardContent className="grid gap-6 p-6">
        <div className="flex items-center gap-4">
          <CalendarIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <div className="grid grid-cols-[auto_1fr] gap-4">
            <div className="grid gap-1 leading-tight">
              <div className="text-gray-500 dark:text-gray-400 flex justify-between w-full">
                <p className="text-sm">
                  Created: {createdDate
                    ? `${format(new Date(createdDate), "MMM d, yyyy")}`
                    : "No date"}
                </p>
                {lastUpdated && (
                  <>
                    <span className="px-2">•</span>
                    <p className="text-sm">
                      Updated: {format(new Date(lastUpdated), "MMM d, yyyy")}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {categories.length >= 1 ? (
          <>
            <TextureSeparator />
            <div className="flex gap-2">
              <div className="font-semibold text-stone-900 dark:text-white mb-2">
                <Tag className="w-5 h-5 text-stone-500 dark:text-stone-400" />
              </div>
              <div className="flex flex-wrap gap-2">
                <EmojiBadgeList categories={categories} />
              </div>
            </div>
          </>
        ) : null}
        <TextureSeparator />

        {totalAccounts > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <MessageCircleIcon className="w-5 h-5 text-green-500" />
                <div className="flex-1">
                  <div className="font-semibold text-stone-900 dark:text-white">
                    Contact Progress
                  </div>
                  <Progress
                    className="w-full h-2 bg-stone-200 dark:bg-stone-700"
                    value={contactPercentage}
                  />
                  <div className="text-sm text-stone-500 dark:text-stone-400">
                    {contactedAccounts} of {totalAccounts} accounts contacted
                  </div>
                </div>
              </div>
            </div>
            
            {contactedAccounts > 0 && (
              <div className="flex items-center gap-4">
                <CheckCircleIcon className="w-5 h-5 text-purple-500" />
                <div>
                  <div className="font-semibold text-stone-900 dark:text-white">
                    Response Rate: {responseRate.toFixed(1)}%
                  </div>
                  <div className="text-sm text-stone-500 dark:text-stone-400">
                    {respondedAccounts} responses from {contactedAccounts} contacts
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </TextureCardContent>

      <TextureCardFooter className="flex justify-between p-6 gap-3">
        <Button
          variant="outline"
          className=" text-red-700 dark:text-red-400"
          onClick={() => handleDeleteTrip(tripId)}
        >
          <TrashIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          disabled={accounts.length < 1}
          onClick={() => handleShareTrip(tripId)}
        >
          Share
          <SendIcon className=" h-4 w-4 ml-2 " />
        </Button>

        <Button
          asChild
          className="w-full text-black dark:text-white"
          variant="outline"
        >
          <Link href={tripId}>
            Open <FolderOpenIcon className=" h-4 w-4 ml-2 " />
          </Link>
        </Button>
      </TextureCardFooter>
    </TextureCard>
  );
}
