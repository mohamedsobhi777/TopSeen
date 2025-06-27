"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TextureCardTitle, TextureSeparator } from "./cult/texture-card";
import {
  ClipboardListIcon,
  HomeIcon,
  PanelLeftIcon,
  InstagramIcon,
  SearchIcon,
  Settings,
  MicIcon,
  HelpCircleIcon,
  Bot,
  Bed,
} from "lucide-react";
import { extractAndDecodeTripName } from "@/lib/utils";
import { useRxData } from "rxdb-hooks";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import Image from "next/image";
import { ModeToggle } from "./ui/theme-provider";
import { Input } from "./ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { GlobalSearch } from "./global-search";

export function MobileNav({
  onTourTrigger,
}: {
  onTourTrigger?: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4  bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeftIcon className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="sm:max-w-xs flex flex-col items-start justify-center p-0 "
        >
          <SheetHeader className="w-full  mt-12">
            <a
              href="https://www.topseen.co"
              target="_blank"
              className="group text-lg font-semibold mr-auto justify-center flex gap-2"
            >
              <div className="flex items-center gap-2 p-4 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 200 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M99.9994 153.877C141.147 153.877 176.851 127.54 194.627 111.673C201.789 105.28 201.789 94.597 194.627 88.204C176.851 72.3371 141.147 46 99.9994 46C58.8516 46 23.1479 72.3371 5.37163 88.2041C-1.79055 94.597 -1.79054 105.28 5.37164 111.673C23.1479 127.54 58.8516 153.877 99.9994 153.877ZM99.9994 137.57C120.783 137.57 137.631 120.722 137.631 99.9383C137.631 79.1551 120.783 62.3069 99.9994 62.3069C79.2161 62.3069 62.368 79.1551 62.368 99.9383C62.368 120.722 79.2161 137.57 99.9994 137.57Z"
                    fill="white"
                  />
                </svg>
                <span className="font-bold text-2xl">TopSeen</span>
              </div>
            </a>
          </SheetHeader>
          {/* CAMPAIGN HISTORY */}
          <div className="h-[calc(100vh-250px)] justify-between flex flex-col  items-start  w-full  pr-12">
            <NavCampaignHistory />
            <div className="flex flex-col gap-4 pl-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={onTourTrigger}
                className="justify-start gap-2 text-muted-foreground hover:text-foreground"
              >
                <HelpCircleIcon className="h-4 w-4" />
                Product Tour
              </Button>
              <ModeToggle />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}

export function DesktopNav({ onTourTrigger }: { onTourTrigger?: () => void }) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background dark:border-r-white/20 sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 py-4">
        <Link
          href="/"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-lg font-semibold text-white md:h-8 md:w-8 md:text-base"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 transition-all group-hover:scale-110"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M99.9994 153.877C141.147 153.877 176.851 127.54 194.627 111.673C201.789 105.28 201.789 94.597 194.627 88.204C176.851 72.3371 141.147 46 99.9994 46C58.8516 46 23.1479 72.3371 5.37163 88.2041C-1.79055 94.597 -1.79054 105.28 5.37164 111.673C23.1479 127.54 58.8516 153.877 99.9994 153.877ZM99.9994 137.57C120.783 137.57 137.631 120.722 137.631 99.9383C137.631 79.1551 120.783 62.3069 99.9994 62.3069C79.2161 62.3069 62.368 79.1551 62.368 99.9383C62.368 120.722 79.2161 137.57 99.9994 137.57Z"
              fill="white"
            />
          </svg>
          <span className="sr-only">TopSeen</span>
        </Link>

        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/"
              className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8 ${isActive("/")
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <HomeIcon className="h-5 w-5" />
              <span className="sr-only">Dashboard</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Dashboard</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/search"
              className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8 ${isActive("/results")
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <SearchIcon className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Search</TooltipContent>
        </Tooltip>

        {/* <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/chat"
              className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8 ${
                isActive("/chat") 
                  ? "bg-accent text-accent-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Bot className="h-5 w-5" />
              <span className="sr-only">AI Chat</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">AI Chat Assistant</TooltipContent>
        </Tooltip> */}

        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/voice"
              className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8 ${isActive("/voice")
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <MicIcon className="h-5 w-5" />
              <span className="sr-only">Voice</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Voice Cloning</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/library"
              className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8 ${isActive("/library")
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <ClipboardListIcon className="h-5 w-5" />
              <span className="sr-only">Library</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Instagram Library</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/thread"
              className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8 ${isActive("/thread")
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <Bot className="h-5 w-5" />
              <span className="sr-only">AI Chat</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">AI Chat</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/background-agents"
              className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8 ${isActive("/background-agents")
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <Bed className="h-5 w-5" />
              <span className="sr-only">Background Agents</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Background Agents</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/settings"
              className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8 ${isActive("/settings")
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Settings</TooltipContent>
        </Tooltip>
      </nav>

      <nav className="mt-auto flex flex-col items-center gap-4 px-2 pb-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onTourTrigger}
              className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors text-muted-foreground hover:text-foreground md:h-8 md:w-8"
            >
              <HelpCircleIcon className="h-5 w-5" />
              <span className="sr-only">Product Tour</span>
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">Product Tour</TooltipContent>
        </Tooltip>
        <ModeToggle />
      </nav>
    </aside>
  );
}

function NavCampaignHistory() {
  const pathname = usePathname();
  const { result: campaigns_v0, isFetching } = useRxData<{
    tripId: string;
    tripName: string;
  }>("trips_v0", (collection) => collection.find({}));

  if (isFetching || campaigns_v0.length === 0) {
    return null;
  }

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  return (
    <div className="flex flex-col items-start w-full rounded-r-[24px] border border-black/10 shadow-sm dark:border-stone-950/60 bg-gradient-to-b dark:from-neutral-800 dark:to-stone-800 from-neutral-100 to-white">
      <TextureCardTitle className="flex gap-1 pt-6 pl-3 dark:text-neutral-400 text-neutral-600">
        <span>Campaigns</span>
      </TextureCardTitle>

      <nav className="grid gap-4 text-lg font-medium mt-6 w-full pb-6">
        <TextureSeparator />
        <div className="pl-3 flex flex-col space-y-3">
          <Link
            href="/"
            className={`flex gap-2 items-center w-full rounded-md py-2 px-2.5 transition-colors ${isActive("/")
                ? "bg-accent text-accent-foreground"
                : "bg-neutral-100 dark:bg-neutral-800 text-muted-foreground hover:text-foreground"
              }`}
          >
            <HomeIcon /> All campaigns
          </Link>
          {campaigns_v0.map((campaign) => (
            <div
              key={campaign.tripId}
              className={`flex justify-between items-center w-full rounded-md py-2 px-2.5 ${isActive(`/${campaign.tripId}`)
                  ? "bg-accent text-accent-foreground"
                  : "bg-neutral-100 dark:bg-neutral-800"
                }`}
            >
              <Link
                className={`flex-1 transition-colors ${isActive(`/${campaign.tripId}`)
                    ? "text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
                href={`/${campaign.tripId}`}
              >
                <div className="flex gap-2 items-center">
                  <ClipboardListIcon />
                  <span>{extractAndDecodeTripName(campaign.tripName)}</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
}
