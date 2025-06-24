import {
  isToday,
  parseISO,
  isFuture,
  closestTo,
  format,
  isSameDay,
  isDate,
} from "date-fns";
import { CalendarFoldIcon } from "lucide-react";
import ListItemCard from "./list-item-card";
import { ChecklistItem } from "@/db/model";

function parseDateInput(input: string) {
  try {
    const parsedDate = parseISO(input);
    if (isDate(parsedDate)) {
      return parsedDate;
    }
  } catch (error) {
    console.error("Invalid date format:", input);
  }
  return null;
}

function safeParseDate(dueDate?: string, startDateTime?: string) {
  const parsedStartDate = startDateTime ? parseDateInput(startDateTime) : null;
  if (parsedStartDate) {
    return parsedStartDate;
  }

  const parsedDueDate = dueDate ? parseDateInput(dueDate) : null;
  if (parsedDueDate) {
    return parsedDueDate;
  }

  console.error("Failed to parse dates:", { dueDate, startDateTime });
  return null;
}

export function GroupedListItems({
  itineraryData,
}: {
  itineraryData: ChecklistItem[];
}) {
  const currentDate = new Date();

  const groupedItinerary = itineraryData.reduce(
    (acc: Record<string, ChecklistItem[]>, item) => {
      const date = safeParseDate(item.dueDate, item.startDateTime);
      if (date) {
        const dateKey = format(date, "yyyy-MM-dd");
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(item);
      }
      return acc;
    },
    {}
  );

  const allDates = Object.values(groupedItinerary)
    .flatMap((group) =>
      group.map((item) => safeParseDate(item.dueDate, item.startDateTime))
    )
    .filter((date) => date && (isFuture(date) || isToday(date)));

  const closestFutureDate =
    allDates.length > 0 ? closestTo(currentDate, allDates) : null;

  const nearestDateGroup = closestFutureDate
    ? Object.entries(groupedItinerary).find(([_, group]) =>
        group.some((item) =>
          isSameDay(
            safeParseDate(item.dueDate, item.startDateTime),
            closestFutureDate
          )
        )
      )?.[1]
    : null;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 lg:space-x-6 gap-0 lg:space-y-8">
      {Object.entries(groupedItinerary).map(([day, items], idx) => {
        const firstItemDate = items[0].startDateTime
          ? parseDateInput(items[0].startDateTime)
          : null;
        const prettyDate = firstItemDate
          ? format(firstItemDate, "EEEE, MMMM d")
          : "No Date";
        const isNearestDateGroup = items === nearestDateGroup;

        return (
          <div
            key={`${day}-${idx}`}
            className={`px-1 py-1 rounded-t-lg lg:rounded-b-lg border-t lg:border-b dark:lg:border-b-white/10 ${
              isNearestDateGroup
                ? "bg-white dark:bg-neutral-900 dark:border-t-white/10 border-t-neutral-300 border-x border-x-neutral-300 dark:border-x-white/10 dark:border-x border-dashed"
                : "bg-neutral-100 dark:bg-neutral-950 dark:border-t-white/10 border-t-black/10 -mt-1.5 shadow-sm dark:border-x-white/10 border-x-black/10 border-x"
            }`}
          >
            <div className="flex mt-1 ml-1 items-center justify-between p-1 rounded-bl-[8px] rounded-tl-[8px] rounded-r-lg">
              <div className="flex items-center">
                <CalendarFoldIcon
                  className={`h-4 w-4 ${
                    isNearestDateGroup
                      ? "stroke-neutral-900/80 dark:stroke-neutral-200/80 fill-pink-50/40 dark:fill-neutral-100/30"
                      : "stroke-neutral-500/80 dark:stroke-neutral-400/80 fill-neutral-500/40 dark:fill-black"
                  }`}
                />
                <span className="pl-2 font-light text-xs text-neutral-500 dark:text-neutral-400">
                  {prettyDate}
                </span>
              </div>
              <span className="mr-2 font-light text-xs text-neutral-500 dark:text-neutral-400">
                day {idx + 1}
              </span>
            </div>
            <div className="pb-6">
              {items.map((todo) => (
                <div
                  key={`${todo.title}-${todo.id}`}
                  className="p-2 mb-2 rounded"
                >
                  <ListItemCard prompt={todo} />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
