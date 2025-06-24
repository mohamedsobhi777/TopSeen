"use client";

import { z } from "zod";
import { toast } from "sonner";
import { format } from "date-fns";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarIcon, Redo, Save } from "lucide-react";

import { cn } from "@/lib/utils";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

import { LoadingButton, LoadingSpinner } from "@/components/loading-button";

import { useAIDrawerState } from "@/lib/global-state";
import { useMutateList } from "@/lib/hooks/use-mutate-list";
import { TravelExamples } from "./ai-examples";
import { TimelineView } from "./ai-timeline";

const updateItineraryFormSchema = z.object({
  userInput: z.string().min(8, "Provide more detailed input"),
  adventureLevel: z.enum(["low", "medium", "high"]),
  prefersOutdoors: z.enum(["true", "false"]),
  startDate: z.date().optional(),
});

export type UpdateItineraryFormValues = z.infer<
  typeof updateItineraryFormSchema
>;

const fadeInOut = {
  initial: {
    opacity: 0,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.03,
      ease: "easeInOut",
    },
  },
};

const fadeInOutQuick = {
  initial: {
    opacity: 0,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.1,
      ease: "easeInOut",
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.03,
      ease: "easeInOut",
    },
  },
};

const buttonCopy = {
  idle: "Generate itinerary with ai",
  loading: <LoadingSpinner size={16} color="rgba(255, 255, 255, 0.65)" />,
  success: "Success!",
  error: "Try again!",
} as const;

export function AIUpdateItineraryForm({ existingItinerary, tripId, tripName }) {
  const [buttonState, setButtonState] =
    useState<keyof typeof buttonCopy>("idle");
  const form = useForm<UpdateItineraryFormValues>({
    resolver: zodResolver(updateItineraryFormSchema),
    defaultValues: {
      prefersOutdoors: "true",
      adventureLevel: "medium",
      startDate: new Date(),
    },
  });

  const { toggleDrawer } = useAIDrawerState();

  const [itineraryPreview, setItineraryPreview] = useState([]);
  const [fullItinerary, setFullItinerary] = useState([]);

  const onSubmit = async (data) => {
    const payload = {
      userInput: data.userInput,
      preferences: {
        adventureLevel: data.adventureLevel,
        prefersOutdoors: data.prefersOutdoors,
      },
      startDate: data.startDate,
      tripId,
      tripName,
      existingItinerary,
    };

    try {
      setButtonState("loading");
      const response = await fetch(
        existingItinerary.length >= 1
          ? "/api/edit-itinerary"
          : "/api/create-itinerary",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const result = await response.json();
      if (response.ok) {
        setButtonState("success");
        setItineraryPreview(result.itinerary);
        setFullItinerary(result.fullItinerary);
      } else {
        throw new Error(result.message || "Failed to update itinerary");
      }
    } catch (error) {
      setButtonState("error");

      setTimeout(() => {
        setButtonState("idle");
      }, 1000);
      toast.error(error.message);
    }
  };

  const mutateTodoList = useMutateList();
  const handleAcceptItinerary = () => {
    mutateTodoList(fullItinerary ? fullItinerary : itineraryPreview);
    toggleDrawer(); // Close the drawer on successful update
  };

  const handleTryAgain = () => {
    form.reset(); // Resets the form state
    setButtonState("idle");
    setItineraryPreview([]); // Clears the preview
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <AnimatePresence>
            {buttonState === "idle" ? (
              <motion.div
                variants={fadeInOut}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <motion.div
                  variants={fadeInOut}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="flex flex-col "
                >
                  <TravelExamples isEdit={existingItinerary.length >= 1} />
                </motion.div>

                <FormField
                  name="userInput"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Travel Idea</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Describe your travel objectives..."
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {existingItinerary.length < 1 ? (
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Start Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-[240px] pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ) : null}
                <div className="hidden">
                  <FormField
                    control={form.control}
                    name="adventureLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adventure Level</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select adventure level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className=" hidden">
                    <FormField
                      control={form.control}
                      name="prefersOutdoors"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preference</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select out door preference" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="true">True</SelectItem>
                                <SelectItem value="false">False</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
          <AnimatePresence>
            {itineraryPreview?.length < 0 ||
            buttonState === "idle" ||
            buttonState === "loading" ? (
              <motion.div
                variants={fadeInOut}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex justify-center"
              >
                <LoadingButton
                  type="submit"
                  status={buttonState}
                  disabled={tripId === null || itineraryPreview.length > 1}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </form>
      </Form>
      <AnimatePresence>
        {itineraryPreview?.length > 0 || buttonState === "loading" ? (
          <motion.div
            variants={fadeInOutQuick}
            initial="initial"
            animate="animate"
            exit="exit"
            className="mt-8"
          >
            <TimelineView
              newItems={itineraryPreview}
              loadingStatus={buttonState}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {itineraryPreview?.length > 0 ? (
          <motion.div
            variants={fadeInOutQuick}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex gap-4 w-full justify-between"
          >
            <Button
              type="button"
              className="w-full"
              variant="outline"
              onClick={handleTryAgain}
            >
              <Redo className="pr-2" />
              <span>Try Again</span>
            </Button>
            <Button
              type="button"
              className="w-full"
              onClick={handleAcceptItinerary}
            >
              <Save className="pr-2" />
              <span>Save Draft</span>
            </Button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
