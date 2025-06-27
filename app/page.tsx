"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import ReactMarkdown from "react-markdown";
import {
  Send,
  ArrowLeft,
  Bot,
  Sparkles,
  RefreshCcw,
} from "lucide-react";
import { DesktopNav, MobileNav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PromptBox } from "@/components/ui/chatgpt-prompt-input";
import { DefaultChatTransport } from "ai";

export default function ChatPage() {
  const router = useRouter();

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
    }),
    messages: [
      {
        id: '1',
        role: 'assistant',
        parts: [
          {
            type: 'text',
            text: "Hi! I'm your AI writing assistant. I can help you craft messages for your Instagram outreach. Just tell me what you want to say or ask for suggestions!",
          }
        ]
      }
    ],
    onToolCall: (toolCall) => {
      console.log('Tool call:', toolCall);
    },
    resume: false,
    maxSteps: 5,
    onError: (error) => {
      console.error('Chat error:', error);
    },
    onFinish: (message) => {
      console.log('AI response finished:', message);
    },
  });

  // Refs for auto-scrolling
  const aiMessagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom(aiMessagesEndRef);
  }, [aiMessages]);

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
    <div className="container mx-auto px-4 py-4 max-w-4xl h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="mb-4 flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-lg font-semibold">AI Writing Assistant</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Get help crafting your Instagram messages
          </p>
        </div>
      </div>

      {/* AI Assistant */}
      <Card className="flex flex-col h-[calc(100%-5rem)]">
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
                                  Message Draft
                                </span>
                              </div>

                              {messageContent && (
                                <div className="text-xs text-green-700 dark:text-green-300 bg-white dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded p-2">
                                  &ldquo;{messageContent}&rdquo;
                                </div>
                              )}
                            </div>
                          );
                        } else if (part.type?.startsWith('tool-')) {
                          // Handle new tool call format: tool-{toolName}
                          const toolName = part.type.replace('tool-', '');
                          const isCompleted = part.state === "result" || part.state === "done";
                          const isLoading = part.state === "input-streaming" || part.state === "partial";

                          if (toolName === "send_message") {
                            const messageContent = part.args?.message || part.args?.content;
                            return (
                              <div key={index} className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3 mt-2">
                                <div className="flex items-center gap-2 mb-2">
                                  <Send className="h-4 w-4 text-green-600" />
                                  <span className="text-xs font-medium text-green-900 dark:text-green-100">
                                    Message Draft
                                  </span>
                                </div>
                                {messageContent && (
                                  <div className="text-xs text-green-700 dark:text-green-300 bg-white dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded p-2">
                                    &ldquo;{messageContent}&rdquo;
                                  </div>
                                )}
                              </div>
                            );
                          }

                          // Generic tool UI for other tools
                          return (
                            <div key={index} className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg p-3 mt-2">
                              <div className="flex items-center gap-2 mb-2">
                                <Bot className="h-4 w-4 text-purple-600" />
                                <span className="text-xs font-medium text-purple-900 dark:text-purple-100">
                                  {toolName.charAt(0).toUpperCase() + toolName.slice(1).replace('_', ' ')}
                                </span>
                                {isCompleted && (
                                  <span className="text-xs bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">
                                    Completed
                                  </span>
                                )}
                                {isLoading && (
                                  <span className="text-xs bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded">
                                    Loading...
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-purple-700 dark:text-purple-300">
                                {isCompleted
                                  ? "Tool execution completed"
                                  : isLoading
                                    ? "Executing tool..."
                                    : "Tool ready"
                                }
                              </div>
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
                                    Message Draft
                                  </span>
                                </div>
                                {messageContent && (
                                  <div className="bg-white dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded p-2 mb-2">
                                    <div className="text-xs text-green-700 dark:text-green-300 font-medium mb-1">Message Preview:</div>
                                    <div className="text-sm text-green-800 dark:text-green-200">
                                      &ldquo;{messageContent}&rdquo;
                                    </div>
                                  </div>
                                )}
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

                {/* Copy button for AI suggestions */}
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
                          onClick={() => navigator.clipboard.writeText(suggestion)}
                        >
                          📋 Copy
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
            additionalActions={
              <button
                type="button"
                onClick={() => {
                  setAiMessages([]);
                  setSelectedMood(null);
                  setAiInputValue("");
                }}
                disabled={status === 'submitted'}
                className="flex h-6 w-6 items-center justify-center rounded-full text-black dark:text-gray-300 hover:text-gray-700 dark:hover:text-white transition-colors hover:bg-accent dark:hover:bg-[#515151] focus-visible:outline-none disabled:opacity-50"
              >
                <RefreshCcw className="h-4 w-4" />
                <span className="sr-only">Clear chat</span>
              </button>
            }
          />
        </div>
      </Card>
    </div>
  );
} 