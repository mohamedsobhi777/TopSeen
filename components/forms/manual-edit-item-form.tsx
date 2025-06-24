"use client";

import * as z from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { CalendarIcon } from "lucide-react";
import { format, formatISO } from "date-fns";
import React, { ReactNode, useEffect } from "react";
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
  FormDescription,
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
import { useEditListItem } from "@/lib/hooks/use-edit-list-item";
import { ChecklistItem } from "@/db/model";

const formSchema = z.object({
  id: z.string().optional(),
  tripId: z.string(),
  tripName: z.string(),
  title: z.string().min(1, {
    message: "Title is required",
  }),
  description: z
    .string()
    .min(1, {
      message: "Description is required",
    })
    .optional(),
  location: z.object({
    name: z.string().optional(),
    address: z.string().optional(),
  }),
  mapLink: z.string().url({ message: "Must be a valid URL" }).optional(),
  status: z.enum(["not done", "later", "done"]),
  priority: z.enum(["low", "medium", "high"]).optional(),
  notes: z.string().optional(),
  startDateTime: z
    .string({ required_error: "Please select a due date" })
    .optional(),
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

type EditFormSchema = z.infer<typeof formSchema>;

export function EditTodoForm({
  defaultValues,
  children,
}: {
  defaultValues: Partial<EditFormSchema>;
  children?: ReactNode;
}) {
  const editTodo = useEditListItem();
  const form = useForm<EditFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: defaultValues.id,
      tripId: defaultValues.tripId,
      tripName: defaultValues.tripName,
      title: defaultValues.title,

      description: defaultValues.description,
      location: {
        name: defaultValues.location?.name,
        address: defaultValues.location?.address,
      },
      mapLink: defaultValues.mapLink,
      status: defaultValues.status,
      priority: defaultValues.priority,
      notes: defaultValues.notes,
      startDateTime: defaultValues.startDateTime,
      reminderEnabled: defaultValues.reminderEnabled,

      category: defaultValues.category,
      day: defaultValues.day,
      timeOfDay: defaultValues.timeOfDay,
      estimatedTime: defaultValues.estimatedTime,
    },
  });

  // Use useEffect to set values on component mount
  useEffect(() => {
    // You can loop through the defaultValues object or set them individually
    Object.entries(defaultValues).forEach(([key, value]) => {
      if (value !== undefined) {
        form.setValue(key as keyof EditFormSchema, value);
      }
    });
    console.log(form.formState.isDirty);
  }, []); // Depend on defaultValues if they might change over time

  function onSubmit(data: EditFormSchema) {
    // Perform update operation
    Object.entries(defaultValues).forEach(([key, value]) => {
      if (value !== undefined) {
        form.setValue(key as keyof EditFormSchema, value);
      }
    });
    const updatedTodo: Partial<ChecklistItem> = data;
    editTodo(data.id, updatedTodo);
    // Trigger success toast
    toast.success("The travel todo item has been successfully updated.");
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
                    <Input
                      defaultValue={defaultValues.title}
                      placeholder="Enter a title"
                      {...field}
                    />
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
                      defaultValue={defaultValues.description}
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
                name="location.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location Name</FormLabel>
                    <FormControl>
                      <Input
                        defaultValue={defaultValues.location.name}
                        placeholder="Enter location name"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location.address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input
                        defaultValue={defaultValues.location.address}
                        placeholder="Enter address"
                        {...field}
                      />
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
                    <Input
                      defaultValue={defaultValues.mapLink}
                      placeholder="Enter map link"
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
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={defaultValues.status}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="not done">Not Done</SelectItem>
                        <SelectItem value="later">Later</SelectItem>
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
                      defaultValue={field.value || defaultValues.priority}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={defaultValues.priority}
                            placeholder="Select a priority"
                          />
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
                      defaultValue={defaultValues.notes}
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
                name="startDateTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
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
                              format(field.value, "PPP") // Displaying the date in a friendly format
                            ) : defaultValues?.startDateTime ? (
                              format(
                                new Date(defaultValues.startDateTime),
                                "PPP"
                              ) // Ensure to parse string to Date if needed
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
                            field.value
                              ? new Date(field.value)
                              : defaultValues.startDateTime
                              ? new Date(defaultValues.startDateTime)
                              : new Date() // Default to current date if no initial value
                          }
                          onSelect={(date) => field.onChange(formatISO(date))}
                          disabled={(date) =>
                            date < new Date() || date < new Date("1900-01-01")
                          }
                          // initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Select the due date for the todo item.
                    </FormDescription>
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
                    <FormControl>
                      <Input
                        defaultValue={defaultValues.day}
                        placeholder="Enter day"
                        {...field}
                      />
                    </FormControl>
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
                      defaultValue={field.value || defaultValues.timeOfDay}
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
                        <SelectItem value="night">Night</SelectItem>
                        <SelectItem value="all day">All Day</SelectItem>
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
                      <Input
                        defaultValue={defaultValues.estimatedTime}
                        placeholder="e.g. 6 hours"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </ScrollArea>

        <div className="mt-auto flex flex-col gap-2 p-4">
          <Button type="submit">Update Todo</Button>
          {children}
        </div>
      </form>
    </Form>
  );
}
