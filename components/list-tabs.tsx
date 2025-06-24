import { ListFilterIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ListItemCard from "./list-item-card";
import { ListFilter } from "./list-filter";
import { GroupedListItems } from "@/components/grouped-list";
import { ChecklistItem } from "@/db/model";
import { EmptyStateCard, SkeletonCard } from "@/components/cards";

// Tabs and Itinerary Component
export function ItineraryTabs({
  filteredTodos,
  completedTodos,
  isFetching,
  doneFetching,
  handleTodoFilter,
  selectedCategory,
}: {
  filteredTodos: ChecklistItem[];
  completedTodos: ChecklistItem[];
  isFetching: boolean;
  doneFetching: boolean;
  handleTodoFilter: (category: string | null) => void;
  selectedCategory: string | null;
}) {
  return (
    <Tabs defaultValue="todo">
      <div className="flex items-center mb-4">
        <TabsList>
          <TabsTrigger value="todo">
            Todo
            <span className="text-[10px] pl-1 text-foreground/60">
              ({filteredTodos.length})
            </span>
          </TabsTrigger>
          <TabsTrigger value="done">
            Done
            {completedTodos.length ? (
              <span className="text-[10px] pl-1 text-foreground/60">
                ({completedTodos.length})
              </span>
            ) : null}
          </TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 gap-1 text-sm">
                <ListFilterIcon className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only">Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="bg-neutral-100 dark:bg-neutral-900"
              align="end"
            >
              <ListFilter
                selectedCategory={selectedCategory}
                onFilter={handleTodoFilter}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <TabsContent value="todo">
        {isFetching || doneFetching ? (
          <div className="flex flex-col w-full h-full gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : filteredTodos.length !== 0 ? (
          <GroupedListItems itineraryData={filteredTodos} />
        ) : (
          <EmptyState />
        )}
      </TabsContent>
      <TabsContent value="done">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
          {completedTodos.map((todo) => (
            <ListItemCard key={todo.title} prompt={todo} />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}

// Empty State Component
function EmptyState() {
  return (
    <div className="mx-auto px-2 h-full">
      <div className="md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6">
        <div className="mx-auto w-24 h-24 rounded-full bg-yellow-400/5 hidden lg:block">
          <div className="absolute w-24 h-24 bg-[radial-gradient(#e5e7eb_2px,transparent_2px)] [background-size:8px_8px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        </div>
        <EmptyStateCard />
      </div>
    </div>
  );
}
