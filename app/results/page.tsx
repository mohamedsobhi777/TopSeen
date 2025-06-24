"use client";

import { parseAsString, useQueryState } from "nuqs";
import React, { useState } from "react";
import {
  Search,
  User,
  Calendar,
  MessageSquare,
  Users,
  Video,
  Clock,
} from "lucide-react";
import { DesktopNav, MobileNav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Dummy search data
const dummyResults = [
  {
    id: "1",
    type: "user",
    title: "@fashionista_emily",
    description: "Fashion influencer with 125K followers",
    profilePicture: "",
    followers: "125K",
    engagement: "4.2%",
    category: "Fashion",
    verified: true,
    lastActive: "2 hours ago",
  },
  {
    id: "2",
    type: "user",
    title: "@tech_guru_mike",
    description: "Technology reviewer and entrepreneur",
    profilePicture: "",
    followers: "89K",
    engagement: "3.8%",
    category: "Technology",
    verified: false,
    lastActive: "1 day ago",
  },
  {
    id: "3",
    type: "user",
    title: "@lifestyle_sarah",
    description: "Lifestyle blogger sharing daily inspiration",
    profilePicture: "",
    followers: "67K",
    engagement: "5.1%",
    category: "Lifestyle",
    verified: true,
    lastActive: "3 hours ago",
  },
  {
    id: "4",
    type: "campaign",
    title: "Summer Fashion Collection 2024",
    description: "Promotional campaign for new summer collection",
    status: "Active",
    reach: "245K",
    engagement: "6.2%",
    budget: "$5,200",
    duration: "30 days",
  },
  {
    id: "5",
    type: "user",
    title: "@fitness_coach_alex",
    description: "Personal trainer and nutrition expert",
    profilePicture: "",
    followers: "156K",
    engagement: "4.7%",
    category: "Fitness",
    verified: true,
    lastActive: "5 hours ago",
  },
  {
    id: "6",
    type: "campaign",
    title: "Holiday Gift Guide Campaign",
    description: "End-of-year promotional campaign",
    status: "Completed",
    reach: "189K",
    engagement: "4.9%",
    budget: "$3,800",
    duration: "14 days",
  },
];

function SearchResultCard({ result }: { result: any }) {
  if (result.type === "user") {
    return (
      <Card className="flex flex-col h-full">
        <CardHeader>
          <div className="flex justify-between items-start w-full">
            <div>
              <Badge
                variant="secondary"
                className="bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-100 mb-2"
              >
                {result.category}
              </Badge>
              <h3 className="font-semibold text-xl text-gray-800 dark:text-white">
                {result.title}
              </h3>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="outline" className="h-8 w-8">
                    <User className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View Profile</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex flex-col items-start justify-between mb-4 space-y-2">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <Users className="h-4 w-4 mr-1" />
              <span>{result.followers} Followers</span>
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <Clock className="h-4 w-4 mr-1" />
              <span>Last active: {result.lastActive}</span>
            </div>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-200 mb-4">
            {result.description}
          </p>
          <div className="space-y-2">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <MessageSquare className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (result.type === "campaign") {
    return (
      <Card className="flex flex-col h-full">
        <CardHeader>
          <div className="flex justify-between items-start w-full">
            <div>
              <Badge
                variant={result.status === "Active" ? "default" : "secondary"}
                className="mb-2"
              >
                {result.status}
              </Badge>
              <h3 className="font-semibold text-xl text-gray-800 dark:text-white">
                {result.title}
              </h3>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="outline" className="h-8 w-8">
                    <Calendar className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View Campaign Details</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex flex-col items-start justify-between mb-4 space-y-2">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <Clock className="h-4 w-4 mr-1" />
              <span>Duration: {result.duration}</span>
            </div>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-200 mb-4">
            {result.description}
          </p>
          <div className="space-y-2">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <MessageSquare className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}

export default function SearchResultsPage() {
  const [query, setQuery] = useQueryState("query", parseAsString.withDefault(""));

  // Filter and sort results based on query and filters
  const filteredResults = dummyResults
    .filter(result => {
      if (!query) return true;
      
      const searchTerm = query.toLowerCase();
      const matchesQuery = 
        result.title.toLowerCase().includes(searchTerm) ||
        result.description.toLowerCase().includes(searchTerm) ||
        (result.category && result.category.toLowerCase().includes(searchTerm));
      
      return matchesQuery;
    });

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 dark:bg-black/80">
      <DesktopNav />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <MobileNav 
          filterByCountryId={null}
          searchQuery=""
          handleSearchChange={() => {}}
        />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8 max-w-6xl">
            {/* Search Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Search Results</h1>
              <p className="text-gray-600 dark:text-gray-400">
                {query ? `Results for "${query}"` : "Enter a search term to find users and campaigns"}
              </p>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for users, campaigns, or content..."
                  className="w-full pl-10 h-12"
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Result Count */}
            <div className="flex justify-end mb-6">
              <div className="text-sm text-gray-500">
                {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''} found
              </div>
            </div>

            {/* Results */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredResults.length > 0 ? (
                filteredResults.map((result) => (
                  <SearchResultCard key={result.id} result={result} />
                ))
              ) : (
                <Card className="col-span-full">
                  <CardContent className="p-12 text-center">
                    <Search className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No results found</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {query 
                        ? `We couldn't find any results for "${query}". Try adjusting your search terms.`
                        : "Start typing to search for users, campaigns, and content."
                      }
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 