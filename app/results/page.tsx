"use client";

import { useSearchParams } from "next/navigation";
import { parseAsString, useQueryState } from "nuqs";
import { useState } from "react";
import { Search, Filter, SortAsc, User, Mail, Calendar, Tag } from "lucide-react";
import { DesktopNav, MobileNav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
    lastActive: "2 hours ago"
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
    lastActive: "1 day ago"
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
    lastActive: "3 hours ago"
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
    duration: "30 days"
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
    lastActive: "5 hours ago"
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
    duration: "14 days"
  }
];

function SearchResultCard({ result }: { result: any }) {
  if (result.type === "user") {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src={result.profilePicture} />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                {result.title.charAt(1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{result.title}</h3>
                {result.verified && (
                  <Badge variant="secondary" className="text-xs">Verified</Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{result.description}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {result.followers} followers
                </span>
                <span>{result.engagement} engagement</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {result.lastActive}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant="outline">{result.category}</Badge>
              <Button size="sm">View Profile</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (result.type === "campaign") {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{result.title}</h3>
                <Badge variant={result.status === "Active" ? "default" : "secondary"}>
                  {result.status}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{result.description}</p>
              <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                <span>{result.reach} reach</span>
                <span>{result.engagement} engagement</span>
                <span>{result.budget} budget</span>
                <span>{result.duration}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button size="sm" variant="outline">View Campaign</Button>
              <Button size="sm">Edit</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}

export default function SearchResultsPage() {
  const [query, setQuery] = useQueryState("query", parseAsString.withDefault(""));
  const [sortBy, setSortBy] = useState("relevance");
  const [filterType, setFilterType] = useState("all");

  // Filter and sort results based on query and filters
  const filteredResults = dummyResults
    .filter(result => {
      if (!query) return true;
      
      const searchTerm = query.toLowerCase();
      const matchesQuery = 
        result.title.toLowerCase().includes(searchTerm) ||
        result.description.toLowerCase().includes(searchTerm) ||
        (result.category && result.category.toLowerCase().includes(searchTerm));
      
      if (filterType === "all") return matchesQuery;
      return matchesQuery && result.type === filterType;
    })
    .sort((a, b) => {
      if (sortBy === "relevance") {
        // Simple relevance based on title match
        const aMatch = a.title.toLowerCase().includes(query.toLowerCase()) ? 1 : 0;
        const bMatch = b.title.toLowerCase().includes(query.toLowerCase()) ? 1 : 0;
        return bMatch - aMatch;
      }
      if (sortBy === "followers" && a.followers && b.followers) {
        const aNum = parseInt(a.followers.replace(/[^\d]/g, ""));
        const bNum = parseInt(b.followers.replace(/[^\d]/g, ""));
        return bNum - aNum;
      }
      return 0;
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

            {/* Filters and Sort */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="user">Users</SelectItem>
                    <SelectItem value="campaign">Campaigns</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <SortAsc className="w-4 h-4" />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="followers">Followers</SelectItem>
                    <SelectItem value="engagement">Engagement</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="ml-auto text-sm text-gray-500">
                {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''} found
              </div>
            </div>

            {/* Results */}
            <div className="space-y-4">
              {filteredResults.length > 0 ? (
                filteredResults.map((result) => (
                  <SearchResultCard key={result.id} result={result} />
                ))
              ) : (
                <Card>
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