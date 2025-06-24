"use client";

import React, { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Send,
  ArrowLeft,
  Bot,
  User,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { DesktopNav, MobileNav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

// Dummy user data (in a real app, this would come from an API)
const dummyUsers = {
  "1": {
    id: "1",
    username: "@fashionista_emily",
    name: "Emily Johnson",
    followers: "125K",
    category: "Fashion",
    verified: true,
  },
  "2": {
    id: "2",
    username: "@tech_guru_mike",
    name: "Mike Chen",
    followers: "89K",
    category: "Technology",
    verified: false,
  },
  "3": {
    id: "3",
    username: "@lifestyle_sarah",
    name: "Sarah Wilson",
    followers: "67K",
    category: "Lifestyle",
    verified: true,
  },
};

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  isFromUser: boolean;
}

interface AIMessage {
  id: string;
  text: string;
  timestamp: Date;
  isFromUser: boolean;
}

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;
  
  // Get target user data
  const targetUser = dummyUsers[userId as keyof typeof dummyUsers];
  
  // Human chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  
  // AI chat state
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([
    {
      id: "1",
      text: "Hi! I&apos;m your AI writing assistant. I can help you craft messages for your conversation with " + (targetUser?.name || "this user") + ". Just tell me what you want to say or ask for suggestions!",
      timestamp: new Date(),
      isFromUser: false,
    }
  ]);
  const [newAiMessage, setNewAiMessage] = useState("");
  
  // Refs for auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const aiMessagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom(messagesEndRef);
  }, [messages]);
  
  useEffect(() => {
    scrollToBottom(aiMessagesEndRef);
  }, [aiMessages]);
  
  if (!targetUser) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-muted/40 dark:bg-black/80">
        <DesktopNav />
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <main className="flex-1 flex items-center justify-center">
            <Card>
              <CardContent className="p-6">
                <h1 className="text-xl font-semibold mb-2">User Not Found</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  The user you're trying to chat with doesn't exist.
                </p>
                <Button onClick={() => router.push("/results")}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Search
                </Button>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    );
  }
  
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      timestamp: new Date(),
      isFromUser: true,
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage("");
    
    // Simulate receiving a response (in a real app, this would be handled differently)
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thanks for your message! This is a simulated response.",
        timestamp: new Date(),
        isFromUser: false,
      };
      setMessages(prev => [...prev, response]);
    }, 1000);
  };
  
  const handleSendAiMessage = async () => {
    if (!newAiMessage.trim()) return;
    
    const userMessage: AIMessage = {
      id: Date.now().toString(),
      text: newAiMessage,
      timestamp: new Date(),
      isFromUser: true,
    };
    
    setAiMessages(prev => [...prev, userMessage]);
    setNewAiMessage("");
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse: AIMessage = {
        id: (Date.now() + 1).toString(),
                 text: `Here&apos;s a suggestion for your message: "${newAiMessage.includes('help') ? 'Hi ' + targetUser.name + '! I hope you&apos;re having a great day. I&apos;d love to connect and learn more about your work in ' + targetUser.category.toLowerCase() + '.' : 'That sounds like a great message! You could also add a personal touch by mentioning something specific about their recent content.'}"`,
        timestamp: new Date(),
        isFromUser: false,
      };
      setAiMessages(prev => [...prev, aiResponse]);
    }, 1500);
  };
  
  const handleSendAiSuggestion = (suggestion: string) => {
    const message: Message = {
      id: Date.now().toString(),
      text: suggestion,
      timestamp: new Date(),
      isFromUser: true,
    };
    
    setMessages(prev => [...prev, message]);
    
    // Simulate receiving a response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thanks for your message! This is a simulated response.",
        timestamp: new Date(),
        isFromUser: false,
      };
      setMessages(prev => [...prev, response]);
    }, 1000);
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
          <div className="container mx-auto px-4 py-4 max-w-7xl h-[calc(100vh-8rem)]">
            {/* Header */}
            <div className="mb-4 flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/results")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Search
              </Button>
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {targetUser.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-lg font-semibold">{targetUser.name}</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {targetUser.username} • {targetUser.followers} followers
                  </p>
                </div>
                {targetUser.verified && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-600">
                    Verified
                  </Badge>
                )}
              </div>
            </div>

            {/* Chat Interface */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100%-5rem)]">
              {/* Left Panel - Human Chat */}
              <Card className="flex flex-col h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MessageCircle className="h-5 w-5" />
                    Chat with {targetUser.name}
                  </CardTitle>
                </CardHeader>
                <Separator />
                
                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                      <div className="text-center">
                        <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Start a conversation with {targetUser.name}</p>
                      </div>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isFromUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg px-3 py-2 ${
                            message.isFromUser
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p className={`text-xs mt-1 ${
                            message.isFromUser 
                              ? 'text-blue-100' 
                              : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            {message.timestamp.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </CardContent>
                
                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={`Message ${targetUser.name}...`}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      size="sm"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Right Panel - AI Assistant */}
              <Card className="flex flex-col h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    AI Writing Assistant
                  </CardTitle>
                </CardHeader>
                <Separator />
                
                {/* AI Messages */}
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {aiMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isFromUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-lg px-3 py-2 ${
                          message.isFromUser
                            ? 'bg-purple-600 text-white'
                            : 'bg-purple-50 dark:bg-purple-900/20 text-purple-900 dark:text-purple-100 border border-purple-200 dark:border-purple-800'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {!message.isFromUser && (
                            <Bot className="h-4 w-4 mt-0.5 text-purple-600" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm">{message.text}</p>
                            <p className={`text-xs mt-1 ${
                              message.isFromUser 
                                ? 'text-purple-100' 
                                : 'text-purple-500 dark:text-purple-400'
                            }`}>
                              {message.timestamp.toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          </div>
                        </div>
                        
                        {/* Add "Send" button for AI suggestions */}
                                                 {!message.isFromUser && message.text.includes('Here&apos;s a suggestion') && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-2 h-6 text-xs"
                            onClick={() => {
                              const suggestion = message.text.match(/"([^"]*)"/)?.[1];
                              if (suggestion) {
                                handleSendAiSuggestion(suggestion);
                              }
                            }}
                          >
                            <Send className="h-3 w-3 mr-1" />
                            Send This
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={aiMessagesEndRef} />
                </CardContent>
                
                {/* AI Input */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      value={newAiMessage}
                      onChange={(e) => setNewAiMessage(e.target.value)}
                      placeholder="Ask AI for help with your message..."
                      onKeyPress={(e) => e.key === 'Enter' && handleSendAiMessage()}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleSendAiMessage}
                      disabled={!newAiMessage.trim()}
                      size="sm"
                      variant="outline"
                      className="border-purple-200 text-purple-600 hover:bg-purple-50"
                    >
                      <Sparkles className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Quick AI Actions */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 text-xs border-purple-200 text-purple-600 hover:bg-purple-50"
                      onClick={() => setNewAiMessage("Help me write an introduction message")}
                    >
                      Introduction
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 text-xs border-purple-200 text-purple-600 hover:bg-purple-50"
                      onClick={() => setNewAiMessage("Help me write a collaboration proposal")}
                    >
                      Collaboration
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 text-xs border-purple-200 text-purple-600 hover:bg-purple-50"
                      onClick={() => setNewAiMessage("Make my message more professional")}
                    >
                      Professional
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 