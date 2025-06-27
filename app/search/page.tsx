"use client";

import type React from "react";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  ArrowUp,
  BrainCircuit,
  Sparkles,
  Users,
  Instagram,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DesktopNav, MobileNav } from "@/components/nav";
import { Component as ProductTour } from "@/components/ui/disclosure-intro";

export default function HomePage() {
  const [inputValue, setInputValue] = useState("");
  const [searchEnabled, setSearchEnabled] = useState(false);
  const [deepResearchEnabled, setDeepResearchEnabled] = useState(false);
  const [reasonEnabled, setReasonEnabled] = useState(false);

  const [activeCommandCategory, setActiveCommandCategory] = useState<
    string | null
  >(null);
  const [tourOpen, setTourOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const commandSuggestions = {
    influencers: [
      "Find fashion influencers with 10K+ followers",
      "Search for tech reviewers in California",
      "Look for fitness coaches with high engagement",
      "Find food bloggers who post daily",
      "Search for travel photographers under 25",
    ],
    business: [
      "Find business coaches with verified accounts",
      "Search for startup founders in tech",
      "Look for marketing agencies with 50K+ followers",
      "Find e-commerce brands in fashion",
      "Search for SaaS companies with active posting",
    ],
    creators: [
      "Find YouTube creators who cross-post",
      "Search for TikTok creators on Instagram",
      "Look for podcast hosts with visual content",
      "Find artists and designers with portfolios",
      "Search for musicians with upcoming releases",
    ],
  };



  const handleCommandSelect = (command: string) => {
    setInputValue(command);
    setActiveCommandCategory(null);

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      // Redirect to results page with the search query
      router.push(`/results?query=${encodeURIComponent(inputValue.trim())}`);
    }
  };

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
        onClick: () => {
          if (inputRef.current) {
            inputRef.current.focus();
            setInputValue("Find fashion influencers with 10K+ followers who post about sustainable clothing");
          }
        },
      },
    },
    {
      title: "Automate Conversations with AI Agents",
      short_description: "Let AI handle your outreach campaigns",
      full_description:
        "Use our AI agents to automate conversations with discovered accounts. Set up personalized outreach campaigns that engage potential partners and customers at scale while maintaining authentic interactions.",
      action: {
        label: "Explore AI Agents",
        href: "/results",
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
    <div className="flex min-h-screen w-full flex-col bg-muted/40 dark:bg-black/80">

      <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
        {/* Logo */}
        <div className="mb-8 w-20 h-20 relative">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M99.9994 153.877C141.147 153.877 176.851 127.54 194.627 111.673C201.789 105.28 201.789 94.597 194.627 88.204C176.851 72.3371 141.147 46 99.9994 46C58.8516 46 23.1479 72.3371 5.37163 88.2041C-1.79055 94.597 -1.79054 105.28 5.37164 111.673C23.1479 127.54 58.8516 153.877 99.9994 153.877ZM99.9994 137.57C120.783 137.57 137.631 120.722 137.631 99.9383C137.631 79.1551 120.783 62.3069 99.9994 62.3069C79.2161 62.3069 62.368 79.1551 62.368 99.9383C62.368 120.722 79.2161 137.57 99.9994 137.57Z"
              fill="url(#paint0_linear_105_535)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_105_535"
                x1="157.499"
                y1="63.2603"
                x2="106.827"
                y2="158.86"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0.0509862" stopColor="#FFB6E1" />
                <stop offset="1" stopColor="#FBE3EA" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Welcome message */}
        <div className="mb-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center"
          >
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-400 mb-2">
              Find Instagram Accounts
            </h1>
            <p className="text-gray-500 max-w-md">
              Search for influencers, businesses, and creators to grow your campaigns
            </p>
          </motion.div>
        </div>

        {/* Input area with integrated functions and file upload */}
        <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-4">
          <div className="p-4">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search for Instagram accounts..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="w-full text-gray-700 text-base outline-none placeholder:text-gray-400"
            />
          </div>



          {/* Search, Deep Research, Reason functions and actions */}
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchEnabled(!searchEnabled)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${searchEnabled
                    ? "bg-purple-50 text-purple-600 hover:bg-purple-100"
                    : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                  }`}
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
              <button
                onClick={() => setDeepResearchEnabled(!deepResearchEnabled)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${deepResearchEnabled
                    ? "bg-purple-50 text-purple-600 hover:bg-purple-100"
                    : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                  }`}
              >
                <Instagram
                  className={`w-4 h-4 ${deepResearchEnabled ? "text-purple-600" : "text-gray-400"
                    }`}
                />
                <span>Filter</span>
              </button>
              <button
                onClick={() => setReasonEnabled(!reasonEnabled)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${reasonEnabled
                    ? "bg-purple-50 text-purple-600 hover:bg-purple-100"
                    : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                  }`}
              >
                <Sparkles
                  className={`w-4 h-4 ${reasonEnabled ? "text-purple-600" : "text-gray-400"
                    }`}
                />
                <span>Analytics</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${inputValue.trim()
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>


        </div>

        {/* Command categories */}
        <div className="w-full grid grid-cols-3 gap-4 mb-4">
          <CommandButton icon={<Users className="w-5 h-5" />} label="Influencers" isActive={activeCommandCategory === "influencers"} onClick={() => setActiveCommandCategory(activeCommandCategory === "influencers" ? null : "influencers")} />
          <CommandButton icon={<Instagram className="w-5 h-5" />} label="Business" isActive={activeCommandCategory === "business"} onClick={() => setActiveCommandCategory(activeCommandCategory === "business" ? null : "business")} />
          <CommandButton icon={<Sparkles className="w-5 h-5" />} label="Creators" isActive={activeCommandCategory === "creators"} onClick={() => setActiveCommandCategory(activeCommandCategory === "creators" ? null : "creators")} />
        </div>

        {/* Command suggestions */}
        <AnimatePresence>
          {activeCommandCategory && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="w-full mb-6 overflow-hidden">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-3 border-b border-gray-100">
                  <h3 className="text-sm font-medium text-gray-700">
                    {activeCommandCategory === "influencers" ? "Influencer search suggestions" : activeCommandCategory === "business" ? "Business account suggestions" : "Creator search suggestions"}
                  </h3>
                </div>
                <ul className="divide-y divide-gray-100">
                  {commandSuggestions[activeCommandCategory as keyof typeof commandSuggestions].map((suggestion, index) => (
                    <motion.li key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.03 }} onClick={() => handleCommandSelect(suggestion)} className="p-3 hover:bg-gray-50 cursor-pointer transition-colors duration-75">
                      <div className="flex items-center gap-3">
                        {activeCommandCategory === "influencers" ? (
                          <Users className="w-4 h-4 text-purple-600" />
                        ) : activeCommandCategory === "business" ? (
                          <Instagram className="w-4 h-4 text-purple-600" />
                        ) : (
                          <Sparkles className="w-4 h-4 text-purple-600" />
                        )}
                        <span className="text-sm text-gray-700">{suggestion}</span>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
    </div>
  );
}

interface CommandButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function CommandButton({ icon, label, isActive, onClick }: CommandButtonProps) {
  return (
    <motion.button onClick={onClick} className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all ${isActive ? "bg-purple-50 border-purple-200 shadow-sm" : "bg-white border-gray-200 hover:border-gray-300"}`}>
      <div className={`${isActive ? "text-purple-600" : "text-gray-500"}`}>{icon}</div>
      <span className={`text-sm font-medium ${isActive ? "text-purple-700" : "text-gray-700"}`}>{label}</span>
    </motion.button>
  );
} 