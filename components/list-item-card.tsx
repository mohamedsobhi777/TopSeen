"use client";

import { toast } from "sonner";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarFoldIcon,
  Clock,
  Edit3Icon,
  Link,
  MapPin,
  Moon,
  NotebookPenIcon,
  Pointer,
  SquareDashedBottomIcon,
  Sun,
  SunriseIcon,
  Sunset,
  Tag,
  Trash2,
} from "lucide-react";

import TextureCard, {
  TextureCardContent,
  TextureCardDescription,
  TextureCardFooter,
  TextureCardHeader,
  TextureCardTitle,
  TextureSeparator,
} from "./cult/texture-card";

import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { IconGoogle } from "./ui/icons";

import { cn } from "@/lib/utils";

import { ChecklistItem, getGradient } from "@/db/model";
import { useUpdateListItemStatus } from "@/lib/hooks/use-update-list-item-status";
import { useCopyToClipboard } from "@/lib/hooks/use-copy-to-clipboard";
import { useDeleteListItem } from "@/lib/hooks/use-delete-list-item-by-id";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { EditTodoForm } from "./forms/manual-edit-item-form";

interface TravelListItemCardProps {
  prompt: ChecklistItem;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.43, 0.13, 0.23, 0.96],
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: {
      duration: 0.4,
      ease: [0.43, 0.13, 0.23, 0.96],
    },
  },
};

const detailsVariants = {
  hidden: { height: 0, opacity: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.4,
      ease: [0.43, 0.13, 0.23, 0.96],
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.4,
      ease: [0.43, 0.13, 0.23, 0.96],
      staggerChildren: 0.1,
      staggerDirection: -1,
    },
  },
};

const detailsChildVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export default function ListItemCard({ prompt }: TravelListItemCardProps) {
  const [selected, setSelected] = useState(false);
  const [status, setStatus] = useState(prompt.status);
  const [isExpanded, setIsExpanded] = useState(false);
  const updateStatus = useUpdateListItemStatus();

  const deleteTodo = useDeleteListItem();

  const [longPress, setLongPress] = useState(false);
  const { copyToClipboard } = useCopyToClipboard({ timeout: 100 });
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startPressTimer = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setLongPress(true);
    }, 140);
  }, []);

  const handleTouchStart = () => {
    startPressTimer();
  };

  const handleTouchEnd = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setLongPress(false);
  };

  const handleLongPress = useCallback(() => {
    if (longPress) {
      copyToClipboard(prompt.location.address);
      toast.success("Address Copied");
      setLongPress(false);
    }
  }, [longPress, copyToClipboard, prompt.location.address]);

  const handleStatusChange = () => {
    const newStatus = status === "not done" ? "done" : "not done";
    setStatus(newStatus);
    console.log("status", newStatus);
    updateStatus({ id: prompt.id, status: newStatus });
  };

  const handleDelete = () => {
    deleteTodo(prompt.id);
  };

  const handleCardClick = () => {
    if (longPress === false) {
      setIsExpanded(!isExpanded);
    }
  };

  useEffect(() => {
    if (longPress) {
      handleLongPress();
    }
  }, [longPress, handleLongPress]);

  return (
    <motion.div
      layoutId={`card-${prompt.title}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={cn("flex flex-col space-y-4")}
    >
      <TextureCard className={cn("relative cursor-pointer")}>
        <CardHeader
          prompt={prompt}
          isExpanded={isExpanded}
          handleCardClick={handleCardClick}
        />

        <div className="flex flex-col space-y-4">
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                key="details"
                variants={detailsVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <CardDetails
                  prompt={prompt}
                  handleTouchStart={handleTouchStart}
                  handleTouchEnd={handleTouchEnd}
                />

                <CardActions
                  prompt={prompt}
                  selected={selected}
                  handleDelete={handleDelete}
                  handleStatusChange={handleStatusChange}
                  status={status}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </TextureCard>
    </motion.div>
  );
}

// CardHeader.tsx
function CardHeader({ prompt, isExpanded, handleCardClick }) {
  const bgColor = getGradient(prompt.category);

  return (
    <TextureCardHeader className="mr-3 ml-4 pb-6" onClick={handleCardClick}>
      <div className="flex flex-col mb-1 -ml-[9.8px]">
        <div className="flex flex-wrap space-x-2 -mt-[18px]">
          {prompt.category && (
            <div className="flex justify-between items-start w-full">
              <div className="flex gap-1">
                <ColorBadge
                  category={prompt.category}
                  variant={isExpanded ? bgColor : "outline"}
                >
                  <span className="pl-1 font-medium">{prompt.category}</span>
                </ColorBadge>
              </div>

              <div className="flex gap-1 -mr-1.5">
                <Badge
                  variant="outline"
                  className="rounded-l-[6px] rounded-tr-lg rounded-br-[2px]"
                >
                  <AnimatedClockIcon isExpanded={isExpanded} />

                  <span className="pl-1 font-medium text-neutral-500/80 dark:text-neutral-400/80">
                    {prompt.estimatedTime}
                  </span>
                </Badge>
              </div>
            </div>
          )}
        </div>
      </div>
      <TextureCardTitle className="text-[1.7rem] leading-7 mt-5 font-brand">
        {prompt.title}
      </TextureCardTitle>
      <TextureCardDescription className="text-base leading-5 mt-2">
        {prompt.description}
      </TextureCardDescription>
    </TextureCardHeader>
  );
}

// CardDetails.tsx
function CardDetails({ prompt, handleTouchStart, handleTouchEnd }) {
  return (
    <TextureCardContent className="pl-4">
      <TextureSeparator />

      <motion.div
        variants={detailsChildVariants}
        className="my-4"
        whileTap={{ scale: 0.9 }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <TextureCardTitle className="text-md">
          <MapPin className="h-5 w-5 text-neutral-500/80" />
        </TextureCardTitle>
        <div className="py-2 grid grid-cols-6">
          <div className="col-span-5">
            <TextureCardTitle className="text-md">
              {prompt.location.name}
            </TextureCardTitle>
            <p className="flex leading-4 gap-1">{prompt.location.address}</p>
          </div>
        </div>
      </motion.div>

      {prompt.timeOfDay && <TimeDetails prompt={prompt} />}

      <TextureSeparator />

      <motion.div variants={detailsChildVariants} className="my-4">
        <TextureCardTitle className="text-md">
          <Link className="h-5 w-5 text-neutral-500/80" />
        </TextureCardTitle>

        <div className="grid grid-cols-2 gap-3 mt-[9px]">
          <div className="flex flex-col justify-center items-center py-6 border border-black rounded-md dark:border-white/10">
            <a href={prompt.mapLink} target="_blank" rel="noopener noreferrer">
              <div className="h-12 w-12">
                <IconGoogle />
              </div>
            </a>
          </div>
        </div>
      </motion.div>

      {prompt.notes && <NotesDetails prompt={prompt} />}
    </TextureCardContent>
  );
}

// TimeDetails.tsx
function TimeDetails({ prompt }) {
  return (
    <div className="mb-4">
      <TextureSeparator />
      <motion.div variants={detailsChildVariants} className="mt-4">
        <TextureCardTitle className="text-md">
          <CalendarFoldIcon className="h-5 w-5 text-neutral-500/80" />
        </TextureCardTitle>

        <div className="flex gap-1 flex-wrap mt-3">
          <div className="flex text-sm">
            <p className="font-semibold bg-neutral-50 dark:bg-neutral-800 border border-black/10 dark:border-white/10 border-r-neutral-300/60 dark:border-r-neutral-800/60 px-2 py-2 rounded-l-md">
              {prompt.timeOfDay === "morning" ? (
                <SunriseIcon className="fill-yellow-300 stroke-yellow-800 dark:stroke-yellow-200 h-5 w-5" />
              ) : prompt.timeOfDay === "mid day" ? (
                <Sun className="fill-amber-500 stroke-amber-800 dark:stroke-amber-200 h-5 w-5" />
              ) : prompt.timeOfDay === "evening" ? (
                <Sunset className="text-neutral-500/80 fill-white dark:fill-neutral-900 h-5 w-5" />
              ) : (
                <Moon className="fill-indigo-400/40 stroke-indigo-500/80 dark:stroke-indigo-400/80 h-5 w-5" />
              )}
            </p>

            <p className="font-bold text-neutral-900/90 dark:text-neutral-100/90 bg-white dark:bg-neutral-800 border border-l-white dark:border-l-black px-2 py-2 rounded-r-md border-black/10 dark:border-white/10 border-l-neutral-300/60 text-sm">
              {prompt.timeOfDay}
            </p>
          </div>

          <div className="flex">
            <div className="font-semibold bg-neutral-50 dark:bg-neutral-800 border border-black/10 dark:border-white/10 border-r-neutral-300/60 dark:border-r-neutral-800/60 px-2 py-2 rounded-l-md">
              <CalendarFoldIcon className="h-5 w-5 text-neutral-500/80 fill-white dark:fill-neutral-900" />
            </div>

            <p className="font-bold text-neutral-900/90 dark:text-neutral-100/90 text-sm bg-white dark:bg-neutral-800 border border-l-white dark:border-l-black px-2 py-2 rounded-r-md border-black/10 dark:border-white/10 border-l-neutral-300/60">
              {prompt?.day?.replace("day_", " ")}
            </p>
          </div>

          <div className="flex">
            <p
              className={cn(
                "font-semibold bg-neutral-50 dark:bg-neutral-800 border border-black/10 dark:border-white/10 border-r-neutral-300/60 dark:border-r-neutral-800/60 px-2 py-2 rounded-l-md"
              )}
            >
              <Tag
                className={cn(
                  "h-5 w-5 text-neutral-500/80 fill-white dark:fill-neutral-900"
                )}
              />
            </p>
            <p className="font-bold lowercase text-neutral-900/90 dark:text-neutral-100/90 text-sm bg-white dark:bg-neutral-800 border border-l-white dark:border-l-black px-2 py-2 rounded-r-md border-black/10 dark:border-white/10 border-l-neutral-300/60">
              {prompt.category}
            </p>
          </div>
          <div className="flex">
            <p className="font-semibold bg-neutral-50 dark:bg-neutral-800 border border-black/10 dark:border-white/10 border-r-neutral-300/60 dark:border-r-neutral-800/60 px-2 py-2 rounded-l-md">
              <Clock className="h-5 w-5 text-neutral-500/80 fill-white dark:fill-neutral-900" />
            </p>
            <p className="font-bold lowercase text-neutral-900/90 dark:text-neutral-100/90 text-sm bg-white dark:bg-neutral-800 border border-l-white dark:border-l-black px-2 py-2 rounded-r-md border-black/10 dark:border-white/10 border-l-neutral-300/60">
              {prompt.estimatedTime}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// NotesDetails.tsx
function NotesDetails({ prompt }) {
  return (
    <div className="mb-0">
      <TextureSeparator />
      <motion.div variants={detailsChildVariants} className="mt-4">
        <TextureCardTitle className="text-md">
          <NotebookPenIcon className="h-5 w-5 text-neutral-500/80" />
        </TextureCardTitle>

        <div className="mt-4 max-w-xs w-full text-sm">{prompt.notes}</div>
      </motion.div>
    </div>
  );
}

// CardActions.tsx
function CardActions({
  prompt,
  selected,
  handleDelete,
  handleStatusChange,
  status,
}) {
  return (
    <motion.div variants={detailsChildVariants} className="mt-7">
      <TextureCardFooter className="bg-neutral-100 dark:bg-neutral-950 rounded-b-[18px] w-full z-50">
        <div className="flex flex-col gap-4 w-full">
          <div className="grid grid-cols-3 gap-3">
            <Button
              size="xs"
              variant="destructive"
              type="reset"
              className="col-span-1 w-full bg-orange-50/60 shadow-sm hover:bg-orange-100 border border-orange-950/10 dark:border-orange-100/10 font-semibold tracking-tight text-orange-800/90"
              onClick={handleDelete}
            >
              <AnimatePresence mode="wait">
                {selected ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{
                      duration: 0.2,
                      ease: "easeOut",
                    }}
                  >
                    <Pointer className="h-6 w-6 rotate-90 fill-orange-400 stroke-1 stroke-black/80" />
                  </motion.div>
                ) : (
                  <motion.span
                    initial={{ opacity: 0.8 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 0.2,
                      type: "easeInOut",
                    }}
                    className="flex"
                  >
                    <Trash2 className="h-4 w-4" />
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>

            <Drawer>
              <DrawerTrigger asChild>
                <Button
                  variant="outline"
                  size="xs"
                  type="button"
                  className="col-span-2 w-full font-semibold tracking-tight bg-neutral-50 shadow-sm border-black/10 dark:border-white/10"
                >
                  <Edit3Icon className="h-4 w-4" />
                  <span className="pl-2">Edit</span>
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                  <DrawerHeader>
                    <DrawerTitle>Edit Item</DrawerTitle>
                    <DrawerDescription>
                      Manually update your itinerary list item.
                    </DrawerDescription>
                  </DrawerHeader>

                  <div className="p-4 pb-0">
                    {/* @ts-ignore */}
                    <EditTodoForm defaultValues={prompt}></EditTodoForm>
                    <DrawerClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
          <Button
            size="lg"
            type="button"
            className="w-full border border-white/10 dark:border-white/10 font-semibold tracking-tight"
            onClick={handleStatusChange}
          >
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{
                    duration: 0.2,
                    ease: "easeOut",
                  }}
                >
                  <Pointer className="h-6 w-6 rotate-90 fill-orange-400 stroke-1 stroke-black/80" />
                </motion.div>
              ) : (
                <motion.span
                  initial={{ opacity: 0.8 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.2,
                    type: "easeInOut",
                  }}
                  className="flex"
                >
                  <SquareDashedBottomIcon className="h-5 w-5 fill-black" />
                  <span className="pl-2">
                    {status === "done"
                      ? "Move back to todo list"
                      : "Mark Complete"}
                  </span>
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </TextureCardFooter>
    </motion.div>
  );
}

function ColorBadge({ variant, category, children }) {
  const TagComponent = gradientFillTag[category] || gradientFillTag.Other;

  return (
    <Badge
      className=" rounded-bl-[4px]  rounded-tl-lg rounded-r-[6px] transition-all duration-300 delay-150"
      variant={variant}
    >
      <TagComponent />
      {children}
    </Badge>
  );
}

export const gradientFillTag = {
  Site: () => (
    <Tag className="h-4 w-4 pr-0.5 text-yellow-900/70 fill-yellow-600" />
  ),
  Town: () => <Tag className="h-4 w-4 pr-0.5 fill-red-500/50 stroke-red-500" />,
  Museum: () => (
    <Tag className="h-4 w-4 pr-0.5 fill-yellow-500/50 stroke-yellow-500" />
  ),
  Relax: () => (
    <Tag className="h-4 w-4 pr-0.5 fill-sky-500/50 stroke-sky-500" />
  ),
  Food: () => (
    <Tag className="h-4 w-4 pr-0.5 fill-pink-500/50 stroke-pink-500" />
  ),
  Meal: () => (
    <Tag className="h-4 w-4 pr-0.5 fill-pink-300/50 stroke-pink-300" />
  ),
  Drive: () => (
    <Tag className="h-4 w-4 pr-0.5 fill-orange-500/50 stroke-orange-500" />
  ),
  Flight: () => (
    <Tag className="h-4 w-4 pr-0.5 fill-orange-700/50 stroke-orange-700" />
  ),
  HistoricSite: () => (
    <Tag className="h-4 w-4 pr-0.5 fill-purple-500/50 stroke-purple-500" />
  ),
  Nightlife: () => (
    <Tag className="h-4 w-4 pr-0.5 fill-pink-500/50 stroke-pink-500" />
  ),
  Activity: () => (
    <Tag className="h-4 w-4 pr-0.5 fill-pink-500/50 stroke-pink-500" />
  ),
  Hike: () => (
    <Tag className="h-4 w-4 pr-0.5 fill-pink-500/50 stroke-pink-500" />
  ),
  Camping: () => (
    <Tag className="h-4 w-4 pr-0.5 fill-blue-500/50 stroke-blue-500" />
  ),
  Accommodation: () => (
    <Tag className="h-4 w-4 pr-0.5 fill-blue-500/50 stroke-blue-500" />
  ),
  Stay: () => (
    <Tag className="h-4 w-4 pr-0.5 fill-blue-500/50 stroke-blue-500" />
  ),
  Other: () => (
    <Tag className="h-4 w-4 pr-0.5 fill-neutral-500/50 neutral-blue-500" />
  ),
  // Unknown: () => <Tag className="text-gray-500">Unknown</Tag>, // Default tag
};

const AnimatedClockIcon = ({ isExpanded }) => {
  const animationVariants = {
    expanded: {
      rotate: 360, // Rotates the icon 360 degrees
      transition: { duration: 8, loop: Infinity, type: "linear" }, // Adjust duration as needed for slower rotation
      // scale: 1.1,
    },
    collapsed: {
      rotate: 0, // Resets rotation when not expanded
      // scale: 1,
    },
  };

  return (
    <motion.div
      variants={animationVariants}
      animate={isExpanded ? "expanded" : "collapsed"}
    >
      <Clock
        className={cn(
          "h-4 w-4 stroke-neutral-500/80   dark:fill-neutral-900 transition-colors duration-500",
          isExpanded
            ? "fill-white stroke-neutral-700 dark:stroke-neutral-300"
            : "fill-neutral-500/20"
        )}
      />
    </motion.div>
  );
};
