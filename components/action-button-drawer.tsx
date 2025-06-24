"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Layers, PlusIcon, Settings2, Sparkles, XIcon } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { ManualCreateNewItemForm } from "./forms/manual-new-item-form";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { NewTripListForm } from "./forms/new-trip-list-form";
import {
  useAIDrawerState,
  useListDrawerState,
  useManualDrawerState,
} from "@/lib/global-state";

const CONTAINER_SIZE = 200;

// Main ActionButton Component
const ActionButtonDrawer = ({ filterByCountryId, children }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => setIsExpanded(!isExpanded);
  const { setIsOpen: setListDrawerOpen } = useListDrawerState();

  useEffect(() => {
    // Close the list drawer when the page changes
    setIsExpanded(false);
    setListDrawerOpen(false);
  }, [filterByCountryId, setListDrawerOpen]);

  return (
    <div
      className={cn(
        "rounded-[24px] border border-black/10 shadow-sm dark:border-yellow-400/20",
        "bg-gradient-to-b from-neutral-900 to-black",
        isExpanded
          ? "w-[204px] bg-gradient-to-b dark:from-stone-900 dark:to-neutral-900/80"
          : "dark:from-neutral-900 dark:to-stone-950 bg-gradient-to-b"
      )}
    >
      <div className="rounded-[23px] border border-black/10">
        <div className="rounded-[22px] border dark:border-stone-800 border-white/50">
          <div className="rounded-[21px] border border-neutral-950/20 flex items-center justify-center">
            <ActionButtonContainer
              isExpanded={isExpanded}
              toggleExpand={toggleExpand}
            >
              <CreateItemDrawers
                filterByCountryId={filterByCountryId}
                isExpanded={isExpanded}
              >
                {children}
              </CreateItemDrawers>
              <NewListDrawer
                key={`new-list-drawer-${filterByCountryId}`}
                isExpanded={isExpanded}
                // currentExpanded={currentExpanded}
                filterByCountryId={filterByCountryId}
              />
            </ActionButtonContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

// Container for ActionButton
function ActionButtonContainer({ toggleExpand, isExpanded, children }) {
  return (
    <motion.div
      className={cn(
        "relative border-white/10 border shadow-lg flex flex-col space-y-1 items-center text-white cursor-pointer z-10",
        !isExpanded
          ? "bg-gradient-to-b from-neutral-900 to-stone-900 dark:from-stone-700 dark:to-neutral-800/80"
          : ""
      )}
      layoutRoot
      layout
      initial={{ borderRadius: 21, width: "4rem", height: "4rem" }}
      animate={
        isExpanded
          ? {
              borderRadius: 20,
              width: CONTAINER_SIZE,
              height: CONTAINER_SIZE + 50,
              transition: {
                type: "spring",
                damping: 25,
                stiffness: 400,
                when: "beforeChildren",
              },
            }
          : {
              borderRadius: 21,
              width: "4rem",
              height: "4rem",
            }
      }
    >
      {children}
      <ToggleButton isExpanded={isExpanded} toggleExpand={toggleExpand} />
      <BackgroundPattern isExpanded={isExpanded} />
    </motion.div>
  );
}

// Toggle Button Component
function ToggleButton({ isExpanded, toggleExpand }) {
  return (
    <motion.div
      className="absolute"
      initial={{ x: "-50%" }}
      animate={{
        x: isExpanded ? "0%" : "-50%",
        transition: {
          type: "tween",
          ease: "easeOut",
          duration: 0.3,
        },
      }}
      style={{
        left: isExpanded ? "" : "50%",
        bottom: 6,
      }}
    >
      {isExpanded ? (
        <motion.div
          className="p-[10px] group bg-neutral-800/50 dark:bg-black/50 border border-cyan-100/30 hover:border-cyan-400 text-orange-50 rounded-full shadow-2xl transition-colors duration-300"
          onClick={toggleExpand}
          layoutId="expand-toggle"
          initial={false}
          animate={{
            rotate: -360,
            transition: {
              duration: 0.4,
            },
          }}
        >
          <XIcon className="h-7 w-7 text-cyan-100/30 dark:text-neutral-400/80 group-hover:text-neutral-500 transition-colors duration-200" />
        </motion.div>
      ) : (
        <motion.div
          className="p-[10px] group bg-cyan-400 dark:bg-cyan-500/90 text-cyan-50 border border-cyan-100/10 shadow-2xl transition-colors duration-200"
          style={{ borderRadius: 24 }}
          onClick={toggleExpand}
          layoutId="expand-toggle"
          initial={{ rotate: 180 }}
          animate={{
            rotate: -180,
            transition: {
              duration: 0.4,
            },
          }}
        >
          <PlusIcon className="h-7 w-7 text-black dark:text-neutral-900" />
        </motion.div>
      )}
    </motion.div>
  );
}

// Background Pattern Component
function BackgroundPattern({ isExpanded }) {
  return (
    <motion.div
      layout
      className="absolute bottom-0 -z-10 h-full w-full rounded-[22px] bg-[radial-gradient(#333333_1px,transparent_1px)] [background-size:4px_4px]"
    ></motion.div>
  );
}

// Drawer Button for Manual Creation
function ManualCreateButton({ isExpanded, filterByCountryId }) {
  const { isOpen, setIsOpen } = useManualDrawerState();
  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <AnimatePresence>
        {isExpanded && (
          <DrawerTrigger asChild>
            <motion.button
              className="h-[99px] w-[95px] flex-col bg-gradient-to-t from-yellow-400/60 to-yellow-400/80 dark:from-yellow-500/40 dark:to-yellow-500/60 transition-colors duration-150 hover:to-yellow-400/50 hover:from-yellow-400/60 dark:hover:to-yellow-400/50 dark:hover:from-yellow-400/60 border hover:shadow-inner border-l-yellow-400 border-t-yellow-400 border-b-yellow-300/70 border-r-yellow-400/70 rounded-tl-[18px] rounded-b-[4px] rounded-tr-sm dark:shadow-lg flex items-center justify-center text-black text-sm z-20"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: {
                  type: "spring",
                  bounce: 0.1,
                  delay: 0.27,
                  duration: 0.3,
                },
              }}
              exit={{
                opacity: 0,
                transition: { type: "spring", bounce: 0, duration: 0.1 },
              }}
              style={{ zIndex: 20 }}
            >
              <Settings2 className="stroke-black/80 dark:stroke-yellow-950 dark:stroke-1 fill-yellow-400/70 h-7 w-7" />
              <span className="font-semibold tracking-tight mt-1 text-yellow-50 text-sm">
                Manual
              </span>
            </motion.button>
          </DrawerTrigger>
        )}
      </AnimatePresence>
      <DrawerContent className="border-t-yellow-400 border-t-4 ring ring-yellow-500/70 dark:border-yellow-500 dark:border-x-yellow-500/80 dark:bg-stone-900">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Create New Item</DrawerTitle>
            <DrawerDescription>
              Manually add a new travel item to your list
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <ManualCreateNewItemForm tripId={filterByCountryId}>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </ManualCreateNewItemForm>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

// Drawer Button for AI Creation
function AICreateButton({ isExpanded, children }) {
  const { isOpen, setIsOpen } = useAIDrawerState();
  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <AnimatePresence>
        {isExpanded && (
          <DrawerTrigger asChild>
            <motion.button
              className="h-[99px] w-[95px] flex-col bg-gradient-to-t from-pink-400/60 to-pink-400/80 dark:from-pink-500/40 dark:to-pink-500/60 hover:from-pink-400/60 transition-colors duration-150 hover:to-pink-400/50 dark:hover:to-pink-400/50 dark:hover:from-pink-400/60 border border-t-pink-300 border-b-pink-300/70 border-r-pink-300 border-l-transparent rounded-tl-sm rounded-tr-[18px] dark:shadow-lg flex items-center justify-center text-black text-sm rounded-b-[4px] z-20"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: {
                  type: "spring",
                  bounce: 0.1,
                  duration: 0.3,
                  delay: 0.27,
                },
              }}
              exit={{
                opacity: 0,
                transition: { type: "spring", bounce: 0, duration: 0.1 },
              }}
              style={{ zIndex: 20 }}
            >
              <Sparkles className="stroke-black/80 dark:stroke-pink-950 stroke-1 fill-pink-200/70 dark:fill-pink-400/70 h-7 w-7" />
              <span className="font-semibold tracking-tight mt-1 text-pink-50 dark:text-pink-50 text-sm">
                AI
              </span>
            </motion.button>
          </DrawerTrigger>
        )}
      </AnimatePresence>
      <DrawerContent className="border-t-pink-400 border-t-4 ring ring-pink-500/70 dark:bg-stone-900 dark:border-pink-500 dark:border-x-pink-500/0">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Add to your Itinerary with AI</DrawerTitle>
            <DrawerDescription>
              Simply give a short description of what you want to do and we will
              take care of the rest.
            </DrawerDescription>
          </DrawerHeader>
          <ScrollArea className="h-[calc(100vh-20rem)]">
            <div className="p-4 pb-12">{children}</div>
          </ScrollArea>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

// Component for handling drawer creation forms
function CreateItemDrawers({ isExpanded, filterByCountryId, children }) {
  return (
    <AnimatePresence>
      {isExpanded && filterByCountryId && (
        <motion.div
          key={`${filterByCountryId}-${isExpanded}`}
          className="flex items-center justify-center w-full space-x-1"
        >
          <ManualCreateButton
            isExpanded={isExpanded}
            filterByCountryId={filterByCountryId}
          />
          <AICreateButton isExpanded={isExpanded}>{children}</AICreateButton>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Component for the new list drawer
function NewListDrawer({ filterByCountryId, isExpanded }) {
  const { isOpen: isDrawerOpen, setIsOpen } = useListDrawerState();
  return (
    <>
      {isExpanded && (
        <Drawer
          open={isDrawerOpen}
          onOpenChange={setIsOpen}
          key={`new-list-drawer-${filterByCountryId}`}
        >
          <AnimatePresence mode="popLayout">
            <DrawerTrigger asChild>
              <motion.button
                className={cn(
                  filterByCountryId
                    ? "h-[76px] bg-gradient-to-t rounded-t-[4px] from-cyan-400/60 to-cyan-400/80 dark:from-cyan-500/40 dark:to-cyan-400/60 hover:to-cyan-400/70 hover:from-cyan-400/50 dark:hover:to-cyan-400/70 dark:hover:from-cyan-400/50 transition-colors duration-150 text-cyan-900 text-sm border-t-cyan-400 border-b-cyan-400/70 border-x-cyan-400"
                    : "h-[130px] rounded-t-[18px] bg-gradient-to-t from-cyan-400/60 to-cyan-400/80 dark:from-cyan-500/40 dark:to-cyan-400/60 hover:to-cyan-400/70 hover:from-cyan-400/50 dark:hover:to-cyan-400/70 dark:hover:from-cyan-400/50 transition-colors duration-150 text-cyan-900 text-lg border-t-cyan-400 border-b-cyan-400/70 border-x-cyan-400",
                  "w-full flex-col border hover:shadow-inner dark:shadow-lg flex items-center justify-center rounded-b-sm"
                )}
                initial={{ opacity: 0, y: 2 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    type: "spring",
                    bounce: 0.1,
                    delay: 0.24,
                    duration: 0.27,
                  },
                }}
                style={{ zIndex: 20 }}
              >
                <Layers className="h-7 w-7 stroke-cyan-900 stroke-[1.3px]" />
                <span className="font-semibold tracking-tight mt-1 text-cyan-50">
                  New List
                </span>
              </motion.button>
            </DrawerTrigger>
          </AnimatePresence>
          <DrawerContent className="border-t-cyan-400 border-t-4 ring ring-cyan-500/70 dark:bg-stone-900 dark:border-cyan-500 dark:border-x-cyan-500/80">
            <div className="mx-auto w-full max-w-sm">
              <DrawerHeader>
                <DrawerTitle>Ready.Set.List</DrawerTitle>
                <DrawerDescription>
                  Create a new itinerary list
                </DrawerDescription>
              </DrawerHeader>
              <div className="p-4 pb-12">
                <NewTripListForm />
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}

export default ActionButtonDrawer;
