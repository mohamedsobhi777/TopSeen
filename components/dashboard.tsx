"use client";

import { useState, ChangeEvent, Suspense } from "react";
import { useRxData } from "rxdb-hooks";

import { DesktopNav, MobileNav } from "./nav";
import { AIUpdateItineraryForm } from "@/components/forms/ai-list-form";

import { InstagramAccount } from "@/db/model";
import { ItineraryTabs } from "./list-tabs";
import { Logo } from "@/components/logo";
import ActionButtonDrawer from "./action-button-drawer";
import { TripOverviewList } from "./trip-overview-list";

type DashboardProps = {
  filterByCampaignId?: string | null;
};

// Filter and Search Logic for Instagram Accounts
function useFilteredAccounts(
  accounts: InstagramAccount[],
  category: string | null,
  searchQuery: string
) {
  return accounts.filter((account) => {
    const matchesCategory = !category || account.category === category;
    const matchesSearch =
      !searchQuery ||
      account.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.bio?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
}

// Main Dashboard Component
export function Dashboard({ filterByCampaignId }: DashboardProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const selectors: Partial<InstagramAccount> = filterByCampaignId
    ? { status: "pending", profileId: filterByCampaignId }
    : { status: "pending" };

  const { result: instagramAccountsOg, isFetching } = useRxData<InstagramAccount>(
    "instagram_accounts_v0",
    (collection) =>
      collection?.find({
        selector: selectors,
        sort: [{ createdAt: "desc" }],
      })
  );

  const instagramAccounts = instagramAccountsOg.sort((a, b) => Number(a.id) - Number(b.id));
  const filteredInstagramAccounts = useFilteredAccounts(
    instagramAccounts,
    selectedCategory,
    searchQuery
  );

  const handleAccountFilter = (category: string | null) =>
    setSelectedCategory(category);
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) =>
    setSearchQuery(e.target.value);

  const { result: contactedAccounts, isFetching: contactedFetching } =
    useRxData<InstagramAccount>("instagram_accounts_v0", (collection) =>
      collection?.find({
        selector: {
          status: "contacted",
          profileId: filterByCampaignId,
        },
      })
    );

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 dark:bg-black/80">
      <DesktopNav />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <MobileNav
          filterByCountryId={filterByCampaignId}
          searchQuery={searchQuery}
          handleSearchChange={handleSearchChange}
        />
        {!filterByCampaignId && <Logo />}
        {filterByCampaignId ? (
          <main className="grid flex-1 items-start gap-4 py-4 px-2 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
            <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-3">
              <ItineraryTabs
                filteredTodos={filteredInstagramAccounts}
                completedTodos={contactedAccounts}
                isFetching={isFetching}
                doneFetching={contactedFetching}
                handleTodoFilter={handleAccountFilter}
                selectedCategory={selectedCategory}
              />
            </div>
          </main>
        ) : (
          <TripOverviewList />
        )}
      </div>
      <div className="fixed bottom-4 right-4">
        <Suspense key={`re-render-${filterByCampaignId}`} fallback={null}>
          <ActionButtonDrawer filterByCountryId={filterByCampaignId}>
            <AIUpdateItineraryForm
              tripId={filterByCampaignId ?? null}
              tripName={
                filterByCampaignId ? filterByCampaignId.split("-")[1] : ""
              }
              existingItinerary={filteredInstagramAccounts}
            />
          </ActionButtonDrawer>
        </Suspense>
      </div>
    </div>
  );
}
