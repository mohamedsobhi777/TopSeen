"use client";

import { useState } from "react";
import { useRxData } from "rxdb-hooks";
import { MessageCircle, Users, Send, MoreHorizontal, ArrowLeft, Filter, Mic, Play, Pause, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { InstagramAccount, DMMessage } from "@/db/model";
import { extractAndDecodeTripName } from "@/lib/utils";
import Link from "next/link";

// Mock data for demonstration
const mockMessages: DMMessage[] = [
  {
    id: "1",
    profileId: "profile_1",
    profileUsername: "fashionista_jane",
    content: "Hey! I love your content style. Would you be interested in collaborating?",
    timestamp: "2024-01-20T10:00:00Z",
    isFromUser: true,
    status: "read",
    messageType: "text",
  },
  {
    id: "2",
    profileId: "profile_1",
    profileUsername: "fashionista_jane",
    content: "Thanks for reaching out! I'd love to hear more about the collaboration.",
    timestamp: "2024-01-20T10:30:00Z",
    isFromUser: false,
    status: "delivered",
    messageType: "text",
  },
  {
    id: "3",
    profileId: "profile_1",
    profileUsername: "fashionista_jane",
    content: "I'd love to discuss this further. Here's a quick voice message!",
    timestamp: "2024-01-20T11:00:00Z",
    isFromUser: true,
    status: "delivered",
    messageType: "voice",
  },
];

function AccountCard({ account }: { account: InstagramAccount }) {
  const [showMessages, setShowMessages] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [messageType, setMessageType] = useState<"text" | "voice">("text");
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "contacted": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "responded": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "ignored": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      case "blocked": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const handleSendMessage = () => {
    if (messageType === "text" && !newMessage.trim()) return;
    if (messageType === "voice" && !recordedAudio) return;
    
    if (messageType === "text") {
      console.log("Sending text message:", newMessage, "to", account.username);
      setNewMessage("");
    } else {
      console.log("Sending voice message to", account.username);
      setRecordedAudio(null);
    }
  };

  const handleRecord = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      // Simulate recorded audio
      setRecordedAudio("recorded-audio-sample.mp3");
    } else {
      // Start recording
      setIsRecording(true);
      setRecordedAudio(null);
    }
  };

  const handlePlayAudio = (audioId: string) => {
    setIsPlaying(isPlaying === audioId ? null : audioId);
  };

  if (showMessages) {
    return (
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="flex-shrink-0 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMessages(false)}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <Avatar className="w-10 h-10">
                <AvatarImage src={account.profilePictureUrl} />
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                  {account.displayName?.[0] || account.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-sm">@{account.username}</h3>
                {account.displayName && (
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {account.displayName}
                  </p>
                )}
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {mockMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isFromUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    message.isFromUser
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  {message.messageType === "voice" ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`${
                            message.isFromUser 
                              ? 'text-white hover:bg-white/20' 
                              : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                          }`}
                          onClick={() => handlePlayAudio(message.id)}
                        >
                          {isPlaying === message.id ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </Button>
                        <div className="flex items-center gap-1">
                          <Volume2 className="w-4 h-4" />
                          <div className="flex items-center gap-1">
                            {/* Audio waveform visualization */}
                            {[...Array(12)].map((_, i) => (
                              <div
                                key={i}
                                className={`w-1 bg-current rounded-full ${
                                  isPlaying === message.id 
                                    ? `h-${2 + (i % 3)}` 
                                    : 'h-2'
                                } transition-all`}
                                style={{
                                  animationDelay: `${i * 0.1}s`,
                                  animation: isPlaying === message.id ? 'pulse 1s infinite' : 'none'
                                }}
                              />
                            ))}
                          </div>
                          <span className="text-xs ml-2">0:15</span>
                        </div>
                      </div>
                      <p className="text-xs opacity-75">
                        Voice message • Generated with AI
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm">{message.content}</p>
                  )}
                  <p className={`text-xs mt-1 ${
                    message.isFromUser ? 'text-purple-100' : 'text-gray-500'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t p-4 space-y-3">
            {/* Message Type Toggle */}
            <div className="flex gap-2">
              <Button
                variant={messageType === "text" ? "default" : "outline"}
                size="sm"
                onClick={() => setMessageType("text")}
              >
                Text
              </Button>
              <Button
                variant={messageType === "voice" ? "default" : "outline"}
                size="sm"
                onClick={() => setMessageType("voice")}
              >
                <Mic className="w-4 h-4 mr-1" />
                Voice
              </Button>
            </div>

            {/* Text Message Input */}
            {messageType === "text" && (
              <div className="flex gap-2">
                <Textarea
                  placeholder="Type your message..."
                  className="flex-1 resize-none"
                  rows={2}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button 
                  onClick={handleSendMessage}
                  className="self-end"
                  disabled={!newMessage.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Voice Message Input */}
            {messageType === "voice" && (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isRecording ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <Mic className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {isRecording ? "Recording..." : recordedAudio ? "Audio recorded" : "Ready to record"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {isRecording ? "Tap stop when finished" : "Use your cloned voice for automated messages"}
                    </p>
                  </div>
                  <Button
                    variant={isRecording ? "destructive" : "outline"}
                    size="sm"
                    onClick={handleRecord}
                  >
                    {isRecording ? "Stop" : "Record"}
                  </Button>
                </div>

                {recordedAudio && (
                  <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePlayAudio("recorded")}
                    >
                      {isPlaying === "recorded" ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Preview recorded message</p>
                      <p className="text-xs text-gray-500">~15 seconds • Using your cloned voice</p>
                    </div>
                    <Button
                      onClick={handleSendMessage}
                      disabled={!recordedAudio}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                {!recordedAudio && (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500">
                      Record your message and our AI will convert it using your cloned voice
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={account.profilePictureUrl} />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                {account.displayName?.[0] || account.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-sm">@{account.username}</h3>
              {account.displayName && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {account.displayName}
                </p>
              )}
            </div>
          </div>
          <Badge className={getStatusColor(account.status)} variant="secondary">
            {account.status}
          </Badge>
        </div>
        
        {account.bio && (
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 line-clamp-2">
            {account.bio}
          </p>
        )}
        
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span>{account.followerCount?.toLocaleString() || 0} followers</span>
          <span>{account.messageCount || 0} messages</span>
          {account.responseRate && (
            <span>{account.responseRate}% response rate</span>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1"
            onClick={() => setShowMessages(true)}
          >
            <MessageCircle className="w-3 h-3 mr-1" />
            Message
          </Button>
          <Button size="sm" variant="outline">
            <MoreHorizontal className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function ProfilePage({ campaignId }: { campaignId: string }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const campaignName = extractAndDecodeTripName(campaignId);

  // Mock accounts data - in real app this would come from the database
  const mockAccounts: InstagramAccount[] = [
    {
      id: "1",
      username: "fashionista_jane",
      displayName: "Jane Smith",
      profileId: campaignId,
      profileName: campaignName,
      bio: "Fashion influencer | Style tips | Lifestyle content",
      followerCount: 45000,
      followingCount: 1200,
      postCount: 892,
      profilePictureUrl: "",
      isVerified: true,
      isPrivate: false,
      status: "responded",
      createdAt: "2024-01-15T00:00:00Z",
      updatedAt: "2024-01-20T00:00:00Z",
      category: "Fashion",
      priority: "high",
      notes: "High engagement rate, good fit for brand",
      lastContactDate: "2024-01-18T00:00:00Z",
      reminderEnabled: false,
      tags: ["fashion", "lifestyle"],
      createdBy: "user_123",
      lastUpdatedBy: "user_123",
      messageCount: 3,
      responseRate: 85,
      engagementScore: 92,
    },
    {
      id: "2",
      username: "tech_guru_mike",
      displayName: "Mike Johnson",
      profileId: campaignId,
      profileName: campaignName,
      bio: "Tech reviews | Gadget enthusiast | YouTube creator",
      followerCount: 28000,
      followingCount: 800,
      postCount: 1240,
      profilePictureUrl: "",
      isVerified: false,
      isPrivate: false,
      status: "contacted",
      createdAt: "2024-01-16T00:00:00Z",
      updatedAt: "2024-01-19T00:00:00Z",
      category: "Tech",
      priority: "medium",
      notes: "",
      lastContactDate: "2024-01-19T00:00:00Z",
      reminderEnabled: true,
      tags: ["tech", "reviews"],
      createdBy: "user_123",
      lastUpdatedBy: "user_123",
      messageCount: 1,
      responseRate: 0,
      engagementScore: 78,
    },
  ];

  const filteredAccounts = mockAccounts.filter(account => {
    const matchesSearch = !searchQuery || 
      account.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.bio?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = !selectedStatus || account.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: mockAccounts.length,
    contacted: mockAccounts.filter(a => a.status === "contacted" || a.status === "responded").length,
    responded: mockAccounts.filter(a => a.status === "responded").length,
    pending: mockAccounts.filter(a => a.status === "pending").length,
  };

  return (
    <div className="min-h-screen bg-muted/40 dark:bg-black/80">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Campaigns
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{campaignName}</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your Instagram DM campaign
              </p>
            </div>
            
            <div className="flex gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.contacted}</div>
                <div className="text-sm text-gray-600">Contacted</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.responded}</div>
                <div className="text-sm text-gray-600">Responded</div>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="accounts" className="space-y-6">
          <TabsList>
            <TabsTrigger value="accounts">
              <Users className="w-4 h-4 mr-2" />
              Accounts ({stats.total})
            </TabsTrigger>
            <TabsTrigger value="messages">
              <MessageCircle className="w-4 h-4 mr-2" />
              Messages
            </TabsTrigger>
          </TabsList>

          <TabsContent value="accounts" className="space-y-4">
            <div className="flex gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Input
                  placeholder="Search accounts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                {["pending", "contacted", "responded", "ignored"].map((status) => (
                  <Button
                    key={status}
                    variant={selectedStatus === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedStatus(selectedStatus === status ? null : status)}
                  >
                    {status}
                  </Button>
                ))}
              </div>
              
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredAccounts.map((account) => (
                <AccountCard key={account.id} account={account} />
              ))}
            </div>
            
            {filteredAccounts.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">No accounts found</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="messages" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Message Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Create and manage message templates for your campaigns.
                </p>
                <Button className="mt-4">Create Template</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 