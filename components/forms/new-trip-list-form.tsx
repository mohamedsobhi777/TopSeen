"use client";

import React, { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";

import { nanoid } from "nanoid";
import { ProfileCampaign } from "@/db/model";

import { useCreateTrip } from "@/lib/hooks/use-create-trip";

const formSchema = z.object({
  profileName: z.string().min(1, {
    message: "Campaign name is required",
  }),
  description: z.string().optional(),
  targetAudience: z.string().optional(),
});

type CampaignFormValues = z.infer<typeof formSchema>;

export function NewTripListForm({ children }: { children?: ReactNode }) {
  const createTrip = useCreateTrip();
  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      profileName: "",
      description: "",
      targetAudience: "",
    },
  });

  function onSubmit(data: CampaignFormValues) {
    const id = nanoid(22);
    const profileId = encodeURIComponent(`${id}-__CAMPAIGN__${data.profileName}`);
    const newCampaign: ProfileCampaign = {
      id: id,
      profileId: profileId ?? "000-default",
      profileName: data.profileName ?? "New Campaign",
      description: data.description,
      targetAudience: data.targetAudience,
      isActive: true,
      createdAt: new Date().toISOString(),
      accountCount: 0,
    };
    
    // Reuse existing hook but with new data structure
    createTrip({
      tripId: newCampaign.profileId,
      tripName: newCampaign.profileName,
    });
    
    // Reset form
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className=" ">
        <div className="p-4 space-y-5">
          <FormField
            control={form.control}
            name="profileName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Campaign Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter campaign name (e.g., Fashion Influencers)" {...field} />
                </FormControl>
                <FormDescription>
                  Name your Instagram DM campaign
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe your campaign goals and strategy..."
                    className="resize-none"
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Brief description of your campaign objectives
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="targetAudience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Audience (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g., Fashion influencers with 10K+ followers"
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Define your target Instagram audience
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="mt-auto flex flex-col gap-2 p-4">
          <Button type="submit">Create New Campaign</Button>
          {children}
        </div>
      </form>
    </Form>
  );
}
