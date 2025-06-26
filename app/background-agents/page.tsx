"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  MoreVertical,
  Edit3,
  Trash2,
  Play,
  Pause,
  Bot,
  ArrowLeft,
  Clock,
  Users,
  MessageSquare,
  Settings,
  Activity,
  CheckCircle,
  AlertCircle,
  Zap,
  Target,
  Filter,
  Calendar,
} from "lucide-react";
import { DesktopNav, MobileNav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

interface BackgroundAgent {
  id: string;
  name: string;
  description: string;
  status: "active" | "paused" | "draft";
  triggerType: "new_follower" | "keyword_mention" | "hashtag_usage" | "story_mention" | "scheduled";
  triggerConditions: {
    keywords?: string[];
    hashtags?: string[];
    followerCount?: { min?: number; max?: number };
    accountType?: "verified" | "business" | "personal" | "any";
    schedule?: {
      days: string[];
      startTime: string;
      endTime: string;
    };
  };
  messageFlow: {
    id: string;
    messages: {
      id: string;
      content: string;
      delay: number; // hours
      mood?: string;
    }[];
  };
  targetAccounts: string[]; // Account IDs from library
  analytics: {
    sent: number;
    delivered: number;
    opened: number;
    replied: number;
    blocked: number;
  };
  createdAt: string;
  updatedAt: string;
  lastRunAt?: string;
}

// Sample data
const sampleAgents: BackgroundAgent[] = [
  {
    id: "1",
    name: "Fashion Influencer Outreach",
    description: "Automatically reach out to fashion influencers when they post about sustainable fashion",
    status: "active",
    triggerType: "hashtag_usage",
    triggerConditions: {
      hashtags: ["sustainablefashion", "ecofriendly", "slowfashion"],
      followerCount: { min: 10000, max: 100000 },
      accountType: "verified"
    },
    messageFlow: {
      id: "flow1",
      messages: [
        {
          id: "msg1",
          content: "Hi! I love your content about sustainable fashion. Would you be interested in collaborating?",
          delay: 0,
          mood: "friendly"
        },
        {
          id: "msg2",
          content: "Just following up on my previous message. Let me know if you'd like to discuss a potential partnership!",
          delay: 72,
          mood: "professional"
        }
      ]
    },
    targetAccounts: ["1", "3", "4"],
    analytics: {
      sent: 45,
      delivered: 43,
      opened: 32,
      replied: 8,
      blocked: 1
    },
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
    lastRunAt: "2024-01-22T09:15:00Z"
  },
  {
    id: "2",
    name: "Tech Startup Welcome",
    description: "Welcome new followers interested in tech and startups",
    status: "paused",
    triggerType: "new_follower",
    triggerConditions: {
      keywords: ["startup", "entrepreneur", "tech", "founder"],
      accountType: "business"
    },
    messageFlow: {
      id: "flow2",
      messages: [
        {
          id: "msg1",
          content: "Thanks for following! Excited to connect with fellow entrepreneurs 🚀",
          delay: 24,
          mood: "friendly"
        }
      ]
    },
    targetAccounts: ["2", "5"],
    analytics: {
      sent: 23,
      delivered: 22,
      opened: 18,
      replied: 5,
      blocked: 0
    },
    createdAt: "2024-01-10T15:00:00Z",
    updatedAt: "2024-01-18T11:20:00Z",
    lastRunAt: "2024-01-18T11:20:00Z"
  },
  {
    id: "3",
    name: "Food Blogger Outreach",
    description: "Reach out to food bloggers posting about healthy recipes",
    status: "draft",
    triggerType: "keyword_mention",
    triggerConditions: {
      keywords: ["healthy", "recipe", "nutrition"],
      followerCount: { min: 5000 }
    },
    messageFlow: {
      id: "flow3",
      messages: [
        {
          id: "msg1",
          content: "Love your healthy recipes! Would you be interested in trying our new product?",
          delay: 0,
          mood: "friendly"
        }
      ]
    },
    targetAccounts: ["6", "10"],
    analytics: {
      sent: 0,
      delivered: 0,
      opened: 0,
      replied: 0,
      blocked: 0
    },
    createdAt: "2024-01-22T08:00:00Z",
    updatedAt: "2024-01-22T08:00:00Z"
  }
];

export default function BackgroundAgentsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("overview");
  const [agents, setAgents] = useState<BackgroundAgent[]>(sampleAgents);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<BackgroundAgent | null>(null);

  // Filter agents based on search
  const filteredAgents = agents.filter((agent) =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeAgents = agents.filter(a => a.status === "active");
  const totalMessages = agents.reduce((sum, agent) => sum + agent.analytics.sent, 0);
  const totalReplies = agents.reduce((sum, agent) => sum + agent.analytics.replied, 0);
  const responseRate = totalMessages > 0 ? (totalReplies / totalMessages) * 100 : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "paused": return "bg-yellow-500";
      case "draft": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <Play className="h-3 w-3" />;
      case "paused": return <Pause className="h-3 w-3" />;
      case "draft": return <Edit3 className="h-3 w-3" />;
      default: return <Bot className="h-3 w-3" />;
    }
  };

  const toggleAgentStatus = (agentId: string) => {
    setAgents(agents.map(agent => {
      if (agent.id === agentId) {
        const newStatus = agent.status === "active" ? "paused" : "active";
        return { ...agent, status: newStatus };
      }
      return agent;
    }));
  };

  const deleteAgent = (agentId: string) => {
    setAgents(agents.filter(agent => agent.id !== agentId));
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
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/")}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <div>
                  <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Bot className="h-6 w-6 text-purple-600" />
                    Background Agents
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Automate your Instagram DM outreach with intelligent agents
                  </p>
                </div>
              </div>
              
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Agent
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create Background Agent</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Agent Name</Label>
                        <Input id="name" placeholder="e.g., Fashion Outreach" />
                      </div>
                      <div>
                        <Label htmlFor="trigger">Trigger Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select trigger" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new_follower">New Follower</SelectItem>
                            <SelectItem value="keyword_mention">Keyword Mention</SelectItem>
                            <SelectItem value="hashtag_usage">Hashtag Usage</SelectItem>
                            <SelectItem value="story_mention">Story Mention</SelectItem>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea 
                        id="description" 
                        placeholder="Describe what this agent does..."
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label>Trigger Conditions</Label>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                          <Label htmlFor="keywords">Keywords (comma separated)</Label>
                          <Input id="keywords" placeholder="startup, entrepreneur, tech" />
                        </div>
                        <div>
                          <Label htmlFor="hashtags">Hashtags (comma separated)</Label>
                          <Input id="hashtags" placeholder="startup, tech, entrepreneur" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label>Message Flow</Label>
                      <div className="space-y-3 mt-2">
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Message 1</span>
                            <span className="text-xs text-gray-500">Immediate</span>
                          </div>
                          <Textarea 
                            placeholder="Your first message..."
                            rows={2}
                          />
                        </div>
                        <Button variant="outline" size="sm">
                          <Plus className="h-3 w-3 mr-1" />
                          Add Follow-up Message
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setIsCreateDialogOpen(false)}>
                        Create Agent
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="agents">Agents</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                          <Bot className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{activeAgents.length}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Active Agents</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                          <MessageSquare className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{totalMessages}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Messages Sent</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                          <Users className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{totalReplies}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Replies Received</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                          <Activity className="h-4 w-4 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{responseRate.toFixed(1)}%</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Response Rate</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { agent: "Fashion Influencer Outreach", action: "Sent message", target: "@fashionista_emily", time: "2 minutes ago", status: "success" },
                        { agent: "Tech Startup Welcome", action: "New follower detected", target: "@tech_guru_mike", time: "15 minutes ago", status: "pending" },
                        { agent: "Fashion Influencer Outreach", action: "Received reply", target: "@lifestyle_sarah", time: "1 hour ago", status: "success" },
                        { agent: "Tech Startup Welcome", action: "Message delivered", target: "@startup_founder", time: "2 hours ago", status: "success" },
                      ].map((activity, index) => (
                        <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${
                              activity.status === "success" ? "bg-green-500" : 
                              activity.status === "pending" ? "bg-yellow-500" : "bg-red-500"
                            }`} />
                            <div>
                              <p className="text-sm font-medium">{activity.agent}</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {activity.action} to {activity.target}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">{activity.time}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="agents" className="space-y-6">
                {/* Search and Filters */}
                <div className="flex items-center gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search agents..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>

                {/* Agents Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredAgents.map((agent) => (
                    <Card key={agent.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-3">
                            <div className={`w-3 h-3 rounded-full ${getStatusColor(agent.status)} flex items-center justify-center`}>
                              {/* Status indicator */}
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{agent.name}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {agent.description}
                              </p>
                            </div>
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => toggleAgentStatus(agent.id)}>
                                {agent.status === "active" ? (
                                  <>
                                    <Pause className="h-4 w-4 mr-2" />
                                    Pause
                                  </>
                                ) : (
                                  <>
                                    <Play className="h-4 w-4 mr-2" />
                                    Start
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setEditingAgent(agent)}>
                                <Edit3 className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => deleteAgent(agent.id)}
                                className="text-red-600 dark:text-red-400"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Badge variant="outline" className="text-xs">
                              {agent.triggerType.replace('_', ' ')}
                            </Badge>
                            <Badge 
                              variant={agent.status === "active" ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {getStatusIcon(agent.status)}
                              <span className="ml-1 capitalize">{agent.status}</span>
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600 dark:text-gray-400">Messages Sent</p>
                              <p className="font-semibold">{agent.analytics.sent}</p>
                            </div>
                            <div>
                              <p className="text-gray-600 dark:text-gray-400">Replies</p>
                              <p className="font-semibold">{agent.analytics.replied}</p>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-600 dark:text-gray-400">Response Rate</span>
                              <span className="font-medium">
                                {agent.analytics.sent > 0 
                                  ? ((agent.analytics.replied / agent.analytics.sent) * 100).toFixed(1)
                                  : 0}%
                              </span>
                            </div>
                            <Progress 
                              value={agent.analytics.sent > 0 
                                ? (agent.analytics.replied / agent.analytics.sent) * 100 
                                : 0
                              } 
                              className="h-2"
                            />
                          </div>

                          {agent.lastRunAt && (
                            <p className="text-xs text-gray-500">
                              Last run: {new Date(agent.lastRunAt).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredAgents.length === 0 && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Bot className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-semibold mb-2">No agents found</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {searchQuery ? "No agents match your search criteria." : "Create your first automation agent to get started."}
                      </p>
                      {!searchQuery && (
                        <Button onClick={() => setIsCreateDialogOpen(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Create Your First Agent
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Total Messages</span>
                          <span className="font-semibold">{totalMessages}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Delivered</span>
                          <span className="font-semibold">{agents.reduce((sum, a) => sum + a.analytics.delivered, 0)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Opened</span>
                          <span className="font-semibold">{agents.reduce((sum, a) => sum + a.analytics.opened, 0)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Replied</span>
                          <span className="font-semibold">{totalReplies}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Blocked</span>
                          <span className="font-semibold text-red-600">{agents.reduce((sum, a) => sum + a.analytics.blocked, 0)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Agent Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {agents.map((agent) => (
                          <div key={agent.id} className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium">{agent.name}</p>
                              <p className="text-xs text-gray-500">{agent.analytics.sent} messages</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold">
                                {agent.analytics.sent > 0 
                                  ? ((agent.analytics.replied / agent.analytics.sent) * 100).toFixed(1)
                                  : 0}%
                              </p>
                              <p className="text-xs text-gray-500">response rate</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
