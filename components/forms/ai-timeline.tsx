import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

import TextureCard, {
  TextureCardContent,
  TextureCardDescription,
  TextureCardHeader,
  TextureCardTitle,
  TextureSeparator,
} from "@/components/cult/texture-card";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";

function TimelineItem({ item, isNew }) {
  return (
    <div className="relative pl-2 pb-4  pt-4 flex w-full items-center gap-3">
      {isNew && (
        <span className="flex-shrink-0 w-2 h-2 bg-pink-500/80 rounded-full"></span>
      )}
      <TextureCard
        className={cn(
          isNew ? "text-black dark:text-white" : "text-gray-800",
          "relative w-full"
        )}
      >
        <TextureCardHeader className="w-full pl-3 mb-2">
          <TextureCardTitle className="text-base  font-semibold">
            {item.title}
          </TextureCardTitle>
          <TextureCardDescription className="absolute left-4 top-2 text-xs">
            {item.estimatedTime}
          </TextureCardDescription>
        </TextureCardHeader>
        <TextureSeparator />
        <TextureCardContent className="px-3">
          <Collapsible className="mt-2">
            <CollapsibleTrigger className="flex items-center justify-between text-sm font-medium cursor-pointer">
              View Details
              <ChevronDownIcon className="w-5 h-5" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2 text-gray-600">
              <p>{item.description}</p>
            </CollapsibleContent>
          </Collapsible>
        </TextureCardContent>
      </TextureCard>
    </div>
  );
}

export function TimelineView({ newItems, loadingStatus }) {
  if (loadingStatus === "loading") {
    return (
      <div className="flex flex-col gap-4 pb-6">
        <div className="border border-black/10 p-2 flex flex-col gap-4 rounded-md">
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[105px] w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[105px] w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2 pb-6">
      <Label>New Items</Label>
      <div className="border border-dashed border-black/10 p-2 flex flex-col gap-4 rounded-md">
        {newItems?.map((item) => (
          <TimelineItem
            key={item.id}
            item={item}
            isNew={newItems.find((n: any) => n.id === item.id)}
          />
        ))}
      </div>
    </div>
  );
}
