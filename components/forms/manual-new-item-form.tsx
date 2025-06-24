"use client";

import * as z from "zod";
import { nanoid } from "nanoid";
import { format } from "date-fns";
import React, { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { CalendarIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

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

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";

import { cn } from "@/lib/utils";
import { ChecklistItem } from "@/db/model";
import { useCreateListItem } from "@/lib/hooks/use-create-list-item";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
  description: z
    .string()
    .min(1, {
      message: "Description is required",
    })
    .optional(),
  locationName: z.string().optional(),
  address: z.string().optional(),
  mapLink: z.string().url({ message: "Must be a valid URL" }).optional(),
  status: z.enum(["not done", "later", "done"]),
  priority: z.enum(["low", "medium", "high"]).optional(),
  notes: z.string().optional(),
  dueDate: z.date({ required_error: "Please select a due date" }),

  reminderEnabled: z.boolean().optional(),
  category: z
    .enum([
      "Drive",
      "Flight",
      "Stay",
      "Activity",
      "Meal",
      "Other",
      "Travel",
      "Event",
      "Accommodation",
      "Site",
      "Hike",
    ])
    .optional(),
  day: z
    .string()
    .regex(/^day_\d+$/, {
      message: "Day must be in the format 'day_X' where X is a number",
    })
    .optional(),
  timeOfDay: z
    .enum(["morning", "afternoon", "evening", "night", "all day"])
    .optional(),
  estimatedTime: z.string().optional(),
});

type CreateNewItemFormSchema = z.infer<typeof formSchema>;

export function ManualCreateNewItemForm({
  defaultValues,
  tripId,
  children,
}: {
  defaultValues?: Partial<CreateNewItemFormSchema>;
  children?: ReactNode;
  tripId?: string;
}) {
  const createTodo = useCreateListItem();
  const form = useForm<CreateNewItemFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "not done",
      priority: "medium",
      reminderEnabled: true,
      mapLink: "https://www.google.com/maps",
      category: "Drive",
      day: "day_1",
      timeOfDay: "evening",
      ...defaultValues,
    },
  });

  function onSubmit(data: CreateNewItemFormSchema) {
    // Ensure startDateTime is correctly parsed
    const parsedDueDate = format(data.dueDate, "yyyy-MM-dd'T'HH:mm:ssXXX");
    // @ts-ignore
    const itineraryItem: Partial<ChecklistItem> = {
      ...data,
      id: nanoid(22),
      tripId: tripId ?? "000-default",
      startDateTime: parsedDueDate,
    };

    console.log("CREATE MANUAL ITEM", itineraryItem);
    createTodo(itineraryItem);
    // Reset form
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className=" ">
        <ScrollArea className="h-[calc(100vh-20rem)]">
          <div className="p-4 space-y-5">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter a description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="locationName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter location name" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter address" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="mapLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Map Link</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter map link" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="not done">Not Done</SelectItem>
                        <SelectItem value="later">later</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter notes"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Date</FormLabel>
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
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : new Date() // Default to current date if no initial value
                          }
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date() || date < new Date("1900-01-01")
                          }
                          // initialFocus - https://github.com/shadcn-ui/ui/issues/910#issuecomment-1770255810
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || defaultValues.category}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Other">Other</SelectItem>
                        <SelectItem value="Drive">Drive</SelectItem>
                        <SelectItem value="Flight">Flight</SelectItem>
                        <SelectItem value="Stay">Stay</SelectItem>
                        <SelectItem value="Activity">Activity</SelectItem>
                        <SelectItem value="Meal">Meal</SelectItem>
                        <SelectItem value="Travel">Travel</SelectItem>
                        <SelectItem value="Event">Event</SelectItem>
                        <SelectItem value="Accommodation">
                          Accommodation
                        </SelectItem>
                        <SelectItem value="Site">Site</SelectItem>
                        <SelectItem value="Hike">Hike</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="day"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Day</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a day" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="day_1">Day 1</SelectItem>
                        <SelectItem value="day_2">Day 2</SelectItem>
                        <SelectItem value="day_3">Day 3</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="timeOfDay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time of Day</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time of day" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="morning">Morning</SelectItem>
                        <SelectItem value="afternoon">Afternoon</SelectItem>
                        <SelectItem value="evening">Evening</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="estimatedTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Time</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 6 hours" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </ScrollArea>

        <div className="mt-auto flex flex-col gap-2 p-4">
          <Button type="submit">Save Changes</Button>
          {children}
        </div>
      </form>
    </Form>
  );
}
