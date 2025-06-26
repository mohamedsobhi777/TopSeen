"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  MessageSquare, 
  CheckCircle2, 
  MapPin, 
  ExternalLink,
  Search,
  TrendingUp
} from "lucide-react";
import { InstagramAccount } from "@/app/api/instagram-search/types";

interface InstagramSearchInterfaceProps {
  query: string;
}

interface Activity {
  type: 'search' | 'extract' | 'analyze' | 'planning';
  status: 'pending' | 'complete' | 'warning' | 'error';
  message: string;
  timestamp?: number;
}

export default function InstagramSearchInterface({ query }: InstagramSearchInterfaceProps) {
  const [accounts, setAccounts] = useState<InstagramAccount[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchCompleted, setSearchCompleted] = useState(false);

  useEffect(() => {
    if (query && !isSearching && !searchCompleted) {
      startSearch();
    }
  }, [query, isSearching, searchCompleted]);

  const startSearch = async () => {
    setIsSearching(true);
    setActivities([]);
    setAccounts([]);

    try {
      const response = await fetch('/api/instagram-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

                 for (const line of lines) {
           if (line.trim() && line.startsWith('data: ')) {
             try {
               const message = JSON.parse(line.slice(6));
               
                               if (message.type === 'data-custom' && message.data) {
                  const data = message.data;
                  console.log('Received data:', data.type, data);
                  
                  if (data.type === 'activity') {
                    setActivities(prev => [...prev, data.content]);
                  } else if (data.type === 'partial-results') {
                    // Stream accounts as they come in
                    setAccounts(data.content.accounts || []);
                  } else if (data.type === 'results') {
                    // Final results
                    setAccounts(data.content.accounts || []);
                    setSearchCompleted(true);
                    setIsSearching(false);
                  }
                }
             } catch (e) {
               console.error('Error parsing stream data:', e);
             }
           }
         }
      }
    } catch (error) {
      console.error('Search error:', error);
      setIsSearching(false);
    }
  };

  const handleSendMessage = (account: InstagramAccount) => {
    // Navigate to chat with context about the selected account
    window.location.href = `/chat?account=${encodeURIComponent(JSON.stringify({
      username: account.username,
      name: account.name,
      category: account.category,
      followers: account.followers
    }))}`;
  };

  const getActivityStatusColor = (status: Activity['status']) => {
    switch (status) {
      case 'complete': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  const formatFollowerCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Search Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Instagram Account Search
        </h1>
        <p className="text-gray-600">
          Search query: <span className="font-medium">&ldquo;{query}&rdquo;</span>
        </p>
      </div>

      {/* Activity Monitor */}
      {activities.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Progress
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {activities.slice(-5).map((activity, index) => (
                <div key={index} className="flex items-center gap-3 text-sm">
                  <div 
                    className={`w-2 h-2 rounded-full ${getActivityStatusColor(activity.status)}`}
                  />
                  <span className="flex-1">{activity.message}</span>
                  {activity.timestamp && (
                    <span className="text-gray-400">
                      {new Date(activity.timestamp).toLocaleTimeString()}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isSearching && !searchCompleted && (
        <Card className="mb-6">
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Searching for Instagram accounts...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {accounts.length > 0 && (
        <>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Found {accounts.length} Instagram Account{accounts.length !== 1 ? 's' : ''}
            </h2>
            <Badge variant="outline" className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              AI-Powered Results
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.map((account, index) => (
              <Card key={index} className="flex flex-col h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={account.profilePictureUrl} />
                        <AvatarFallback>
                          {account.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">@{account.username}</h3>
                          {account.verified && (
                            <CheckCircle2 className="h-4 w-4 text-blue-500" />
                          )}
                        </div>
                        <p className="text-gray-600 text-sm">{account.name}</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-grow">
                  <div className="space-y-3">
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                      {account.category}
                    </Badge>

                    <p className="text-sm text-gray-700 overflow-hidden" style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}>
                      {account.bio}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{formatFollowerCount(account.followers)} followers</span>
                      </div>
                      {account.engagement_rate > 0 && (
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          <span>{account.engagement_rate.toFixed(1)}%</span>
                        </div>
                      )}
                    </div>

                    {account.location && (
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{account.location}</span>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button 
                        onClick={() => handleSendMessage(account)}
                        className="flex-1 bg-purple-600 hover:bg-purple-700"
                        size="sm"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Send Message
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(`https://instagram.com/${account.username}`, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* No Results */}
      {searchCompleted && accounts.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <div className="text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No accounts found</h3>
              <p>Try refining your search query or using different keywords.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 