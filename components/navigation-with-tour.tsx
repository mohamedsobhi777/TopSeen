"use client";

import { ReactNode, useState } from "react";
import { DesktopNav, MobileNav } from "@/components/nav";
import { Component as ProductTour } from "@/components/ui/disclosure-intro";

interface NavigationWithTourProps {
  children: ReactNode;
}

export function NavigationWithTour({ children }: NavigationWithTourProps) {
  const [tourOpen, setTourOpen] = useState(false);

  const handleTourTrigger = () => {
    setTourOpen(true);
  };

  const tourSteps = [
    {
      title: "Welcome to TopSeen",
      short_description: "Your Instagram account discovery platform",
      full_description:
        "Welcome to TopSeen! Discover influencers, businesses, and creators to grow your campaigns and reach your target audience effectively.",
      media: {
        type: "image" as const,
        src: "/placeholder.svg",
        alt: "TopSeen platform overview",
      },
    },
    {
      title: "Deep Search for Accounts",
      short_description: "Use AI to find your target users and customers",
      full_description:
        "Use our AI-powered deep search to find Instagram accounts using natural language. Simply describe your target audience or ideal customer, and our AI will understand and find matching accounts for you.",
      action: {
        label: "Try Deep Search",
        href: "/search",
      },
    },
    {
      title: "Automate Conversations with AI Agents",
      short_description: "Let AI handle your outreach campaigns",
      full_description:
        "Use our AI agents to automate conversations with discovered accounts. Set up personalized outreach campaigns that engage potential partners and customers at scale while maintaining authentic interactions.",
      action: {
        label: "Explore AI Agents",
        href: "/background-agents",
      },
    },
    {
      title: "Start Discovering",
      short_description: "Begin your AI-powered discovery journey",
      full_description:
        "You're ready to start discovering! Use natural language to describe your ideal target audience, and let our AI find and connect you with the perfect accounts for your campaigns.",
    },
  ];

  return (
    <>
      <div className="flex h-screen w-full flex-col bg-muted/40 dark:bg-black/80">
        <DesktopNav onTourTrigger={handleTourTrigger} />
        <div className="flex flex-col sm:pl-14">
          <MobileNav onTourTrigger={handleTourTrigger} />
          {children}
        </div>
      </div>
      
      <ProductTour
        open={tourOpen}
        setOpen={setTourOpen}
        steps={tourSteps}
        featureId="topseen-intro"
        showProgressBar={true}
        onComplete={() => {
          console.log("Tour completed");
        }}
        onSkip={() => {
          console.log("Tour skipped");
        }}
      />
    </>
  );
} 