"use client";

import { useSearchParams } from "next/navigation";
import { parseAsString, useQueryState } from "nuqs";
import { useState } from "react";
import { Search, Filter, SortAsc } from "lucide-react";
import { DesktopNav, MobileNav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchResultCard } from "@/components/search-result-card";

// Dummy search data
const dummyResults = [
// ... existing code ...
    budget: "$3,800",
    duration: "14 days"
  }
];

export default function SearchResultsPage() {
  const [query, setQuery] = useQueryState("query", parseAsString.withDefault(""));
// ... existing code ...
            {/* Results */}
            <div className="space-y-4">
              {filteredResults.length > 0 ? (
                filteredResults.map((result) => (
                  <SearchResultCard key={result.id} />
                ))
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
// ... existing code ...
