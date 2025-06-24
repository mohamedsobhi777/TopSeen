"use client";
import { Button } from "@/components/ui/button";

const categoryEmoji = {
  Site: "🏞️",
  //   Food: "🍗",
  Drive: "🚙",
  //   Town: "🏘️",
  Hike: "🌳",
  Camping: "🏕️",
  Relax: "🧘‍♀️",
};

interface ListFilterProps {
  onFilter: (category: string | null) => void;
  selectedCategory: string | null;
}

export const ListFilter: React.FC<ListFilterProps> = ({
  onFilter,
  selectedCategory,
}) => {
  const handleCategoryFilter = (category: string) => {
    if (selectedCategory === category) {
      onFilter(null);
    } else {
      onFilter(category);
    }
  };

  return (
    <fieldset className="  bg-background rounded-xl border  p-1 ">
      <legend className="-ml-1 px-1 text-sm font-medium">Filters</legend>

      <div className="grid grid-cols-2 gap-3 px-4 pb-4 pt-6">
        {Object.entries(categoryEmoji).map(([category, emoji]) => (
          <Button
            size="sm"
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => handleCategoryFilter(category)}
          >
            {emoji} {category}
          </Button>
        ))}
      </div>
    </fieldset>
  );
};
