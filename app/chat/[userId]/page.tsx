"use client";

import React, { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import ReactMarkdown from "react-markdown";
import {
  Send,
  ArrowLeft,
  Bot,
  User,
  MessageCircle,
  Sparkles,
  RefreshCcw,
} from "lucide-react";
import { DesktopNav, MobileNav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { PromptBox } from "@/components/ui/chatgpt-prompt-input";
import { DefaultChatTransport } from "ai";


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

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;

  // Get target user data
  const targetUser = dummyUsers[userId as keyof typeof dummyUsers];

  // Human chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  // AI chat using useChat hook with proper AI SDK 5 Beta configuration
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [aiInputValue, setAiInputValue] = useState("");

  const {
    messages: aiMessages,
    sendMessage,
    regenerate,
    stop,
    resumeStream,
    addToolResult,
    status,
    error,
    setMessages: setAiMessages,
  } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
      headers: {
        'Content-Type': 'application/json',
      },
      // initialMessages: [
      //   {
      //     id: '1',
      //     role: 'assistant',
      //     content: "Hi! I'm your AI writing assistant. I can help you craft messages for your conversation with " + (targetUser?.name || "this user") + ". Just tell me what you want to say or ask for suggestions!",
      //   }
      // ],
    }),
    messages: [
      {
        id: '1',
        role: 'assistant',
        parts: [
          {
            type: 'text',
            text: "Hi! I'm your AI writing assistant. I can help you craft messages for your conversation with " + (targetUser?.name || "this user") + ". Just tell me what you want to say or ask for suggestions!",
          }
        ]
      }
    ],
    onToolCall: (toolCall) => {
      console.log('Tool call:', toolCall);
    },
    resume: false,
    onError: (error) => {
      console.error('Chat error:', error);
    },
    onFinish: (message) => {
      console.log('AI response finished:', message);
    },
  });

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
                  The user you&apos;re trying to chat with doesn&apos;t exist.
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

  const handleSendAiSuggestionToChat = (suggestion: string) => {
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

  const extractSuggestionFromContent = (content: string) => {
    // Try to extract text from quotes first
    const quotedMatch = content.match(/"([^"]*)"/);
    if (quotedMatch) return quotedMatch[1];

    // If no quotes, look for suggestion-like patterns
    const suggestionMatch = content.match(/suggest(?:ion)?:?\s*(.+)/i);
    if (suggestionMatch) return suggestionMatch[1].trim();

    // If it's a short response, return it as is
    if (content.length < 100) return content;

    return null;
  };

  const handleAiSubmit = async (value: string, mood?: string) => {
    try {
      const moodPrompt = mood ? `[Mood: ${mood}] ${value}` : value;
      // Create a custom event for handleInputChange
      const event = { target: { value: moodPrompt } } as React.ChangeEvent<HTMLInputElement>;
      sendMessage({
        role: 'user',
        parts: [
          {
            type: 'text',
            text: moodPrompt,
          }
        ]
      });
      setAiInputValue("");
    } catch (error) {
      console.error('Error submitting AI message:', error);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 dark:bg-black/80">
      <DesktopNav />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <MobileNav
          filterByCountryId={null}
          searchQuery=""
          handleSearchChange={() => { }}
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
                          className={`max-w-[70%] rounded-lg px-3 py-2 ${message.isFromUser
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                            }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p className={`text-xs mt-1 ${message.isFromUser
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
                  {aiMessages.map((message: any) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-lg px-3 py-2 ${message.role === 'user'
                          ? 'bg-purple-600 text-white'
                          : 'bg-purple-50 dark:bg-purple-900/20 text-purple-900 dark:text-purple-100 border border-purple-200 dark:border-purple-800'
                          }`}
                                              >
                          <div className="flex items-start gap-2">
                          {message.role === 'assistant' && (
                            <Bot className="h-4 w-4 mt-0.5 text-purple-600" />
                          )}
                          <div className="flex-1">
                                                        <div className="text-sm">
                              {message.parts.map((part, index) => {
                                // Check if this message has any tool calls
                                const hasToolCalls = message.parts.some(p => p.type.startsWith('tool-'));
                                
                                if (part.type === 'text') {
                                  return <ReactMarkdown key={index}>{part.text}</ReactMarkdown>;
                                } else if (part.type === 'step-start') {
                                  // Don't show step-start at all
                                  return null;
                                } else if (part.type === 'tool-send_message') {
                                  const messageContent = part.args?.message || part.args?.content;
                                  
                                  return (
                                    <div key={index} className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3 mt-2">
                                      <div className="flex items-center gap-2 mb-2">
                                        <Send className="h-4 w-4 text-green-600" />
                                        <span className="text-xs font-medium text-green-900 dark:text-green-100">
                                          Sent
                                        </span>
                                        <span className="text-xs bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                                          ✓
                                        </span>
                                      </div>
                                      
                                      {messageContent && (
                                        <div className="text-xs text-green-700 dark:text-green-300 bg-white dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded p-2">
                                          &ldquo;{messageContent}&rdquo;
                                        </div>
                                      )}
                                    </div>
                                  );
                                } else if (part.type === "tool-invocation") {
                                  // Legacy tool invocation handling (keep for backward compatibility)
                                  const messageContent = part.toolInvocation?.args?.message || part.toolInvocation?.args?.content;
                                  const isCompleted = part.toolInvocation?.state === "result";
                                  
                                  if (part.toolInvocation?.toolName === "send_message") {
                                    return (
                                      <div key={index} className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3 mt-2">
                                        <div className="flex items-center gap-2 mb-2">
                                          <Send className="h-4 w-4 text-green-600" />
                                          <span className="text-xs font-medium text-green-900 dark:text-green-100">
                                            {isCompleted ? "Message Sent" : "Sending Message"}
                                          </span>
                                          {isCompleted && (
                                            <span className="text-xs bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                                              ✓ Delivered
                                            </span>
                                          )}
                                        </div>
                                        {messageContent && (
                                          <div className="bg-white dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded p-2 mb-2">
                                            <div className="text-xs text-green-700 dark:text-green-300 font-medium mb-1">Message Preview:</div>
                                            <div className="text-sm text-green-800 dark:text-green-200">
                                              &ldquo;{messageContent}&rdquo;
                                            </div>
                                          </div>
                                        )}
                                        <div className="text-xs text-green-700 dark:text-green-300">
                                          {isCompleted 
                                            ? `Message successfully sent to ${targetUser.name}`
                                            : "Processing message..."
                                          }
                                        </div>
                                      </div>
                                    );
                                  }
                                  
                                  // Generic tool invocation UI for other tools
                                  return (
                                    <div key={index} className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg p-3 mt-2">
                                      <div className="flex items-center gap-2 mb-2">
                                        <Bot className="h-4 w-4 text-purple-600" />
                                        <span className="text-xs font-medium text-purple-900 dark:text-purple-100">
                                          {part.toolInvocation?.toolName || "Tool Usage"}
                                        </span>
                                        {part.toolInvocation?.state === "result" && (
                                          <span className="text-xs bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">
                                            Completed
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-xs text-purple-700 dark:text-purple-300">
                                        {part.toolInvocation?.state === "result" 
                                          ? "Tool execution completed"
                                          : "Executing tool..."
                                        }
                                      </div>
                                    </div>
                                  );
                                }
                                return null;
                              })}
                            </div>
                            <p className={`text-xs mt-1 ${message.role === 'user'
                              ? 'text-purple-100'
                              : 'text-purple-500 dark:text-purple-400'
                              }`}>
                              {message.createdAt && new Date(message.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>

                        {/* Add "Send" button for AI suggestions */}
                        {message.role === 'assistant' && message.parts && (
                          (() => {
                            // Extract text content from all text parts
                            const textContent = message.parts
                              .filter(part => part.type === 'text')
                              .map(part => part.text)
                              .join(' ');
                            
                            const suggestion = extractSuggestionFromContent(textContent);

                            if (suggestion) {
                              return (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="mt-2 h-6 text-xs"
                                  onClick={() => handleSendAiSuggestionToChat(suggestion)}
                                >
                                  <Send className="h-3 w-3 mr-1" />
                                  Send This
                                </Button>
                              );
                            }
                            return null;
                          })()
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Loading indicator */}
                  {status === 'submitted' && (
                    <div className="flex gap-3 justify-start">
                      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg px-3 py-2 text-sm">
                        <div className="flex items-center gap-1">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-purple-600 ml-2">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Error indicator */}
                  {error && (
                    <div className="flex gap-3 justify-start">
                      <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm">
                        <div className="text-red-800">
                          Sorry, I encountered an error. Please try again.
                        </div>
                        <div className="text-xs text-red-600 mt-1">
                          {error.message}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setAiMessages([]);
                            setAiInputValue("");
                          }}
                          className="mt-2 h-6 text-xs"
                        >
                          <RefreshCcw className="h-3 w-3 mr-1" />
                          Clear & Retry
                        </Button>
                      </div>
                    </div>
                  )}

                  <div ref={aiMessagesEndRef} />
                </CardContent>

                {/* AI Input */}
                <div className="p-4">
                  <PromptBox
                    placeholder="Ask AI for help with your message..."
                    disabled={status === 'submitted'}
                    value={aiInputValue}
                    onChange={setAiInputValue}
                    className="rounded-[8px]"
                    onSubmit={handleAiSubmit}
                    onMoodChange={setSelectedMood}
                  />

                  {/* Quick Actions */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Help me write an introduction message",
                        "Suggest a collaboration proposal",
                        "Make my message more professional"
                      ].map((suggestion, index) => (
                        <Button
                          key={index}
                          size="sm"
                          variant="ghost"
                          className="h-6 text-xs text-purple-600 hover:bg-purple-50"
                          disabled={status === 'submitted'}
                          onClick={() => {
                            setAiInputValue(suggestion);
                          }}
                        >
                          {suggestion.replace("Help me write ", "").replace("Make my message more ", "")}
                        </Button>
                      ))}
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setAiMessages([]);
                        setSelectedMood(null);
                        setAiInputValue("");
                      }}
                      disabled={status === 'submitted'}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <RefreshCcw className="h-3 w-3 mr-1" />
                      Clear
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