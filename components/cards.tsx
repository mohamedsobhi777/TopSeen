import { Plus, InstagramIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import TextureCard, {
  TextureCardContent,
  TextureCardDescription,
  TextureCardFooter,
  TextureCardHeader,
  TextureCardTitle,
  TextureSeparator,
} from "./cult/texture-card";

export function SkeletonCard() {
  return (
    <TextureCard>
      <TextureCardContent>
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[105px] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </TextureCardContent>
    </TextureCard>
  );
}

export function EmptyStateCard() {
  return (
    <TextureCard className="lg:w-96">
      <TextureCardHeader className="flex flex-col gap-1 items-center justify-center p-4">
        <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-3">
          <InstagramIcon className="w-9 h-9 text-white stroke-1 animate-bounce fill-white/50" />
        </div>
        <TextureCardTitle>Create Your First Campaign</TextureCardTitle>
        <p className="text-center">
          Start automating your Instagram DMs <br /> and grow your network.
        </p>
      </TextureCardHeader>
      <TextureSeparator />

      <TextureSeparator />
      <TextureCardFooter className="border-b rounded-b-sm flex flex-col dark:border-b-white/20">
        <div className="flex gap-1 justify-center w-full">
          <p>Click </p>
          <span className="shadow-sm p-0.5 border-2 rounded-full dark:border-neutral-500">
            <Plus className="bg-gradient-to-br from-purple-400 to-pink-400 border border-black/10 rounded-full h-6 w-6 p-1 stroke-white" />
          </span>
          <p>to get started</p>
        </div>
      </TextureCardFooter>

      <div className="dark:bg-neutral-800 bg-stone-100 pt-px rounded-b-[20px] overflow-hidden ">
        <div className="flex flex-col items-center justify-center">
          <div className="py-2 px-2">
            <div className="text-center text-sm">
              Automate your Instagram outreach today.{" "}
            </div>
          </div>
        </div>
        <TextureSeparator />
        <div className="flex flex-col items-center justify-center ">
          <div className="py-2 px-2">
            <div className="text-center text-xs ">
              Powered by{" "}
              <a target="_blank" href="https://topseen.co">
                TopSeen
              </a>
            </div>
          </div>
        </div>
      </div>
    </TextureCard>
  );
}

const categoryEmojis = {
  Influencer: "⭐",
  Business: "💼",
  Personal: "👤",
  Celebrity: "🌟",
  Brand: "🏢",
  Creator: "🎨",
  Lifestyle: "✨",
  Fashion: "👗",
  Tech: "💻",
  Food: "🍗",
  Other: "👤",
};

export function EmojiBadgeList({ categories }) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <Badge
          key={category}
          className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-white px-2 py-1"
          variant="outline"
        >
          {categoryEmojis[category]} {category}
        </Badge>
      ))}
    </div>
  );
}
