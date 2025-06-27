import { v4 as uuidv4 } from "uuid";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useStreamContext } from "@/providers/Stream";
import { useState } from "react";
import { Button } from "../ui/button";
import { Checkpoint, Message } from "@langchain/langgraph-sdk";
import { AssistantMessage, AssistantMessageLoading } from "./messages/ai";
import { HumanMessage } from "./messages/human";
import {
  DO_NOT_RENDER_ID_PREFIX,
  ensureToolCallsHaveResponses,
} from "@/lib/ensure-tool-responses";
import { LangGraphLogoSVG } from "../icons/langgraph";
import { TooltipIconButton } from "./tooltip-icon-button";
import {
  PanelRightOpen,
  PanelRightClose,
  SquarePen,
  XIcon,
  CircleX,
  RefreshCcw,
} from "lucide-react";
import { useQueryState, parseAsBoolean } from "nuqs";
import ThreadHistory from "./history";
import { toast } from "sonner";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { GitHubSVG } from "../icons/github";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  useArtifactOpen,
  ArtifactContent,
  ArtifactTitle,
  useArtifactContext,
} from "./artifact";
import { PromptBox } from "@/components/ui/chatgpt-prompt-input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useTopSeenRules } from "@/lib/hooks/use-topseen-rules";

function OpenGitHubRepo() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            href="https://github.com/langchain-ai/agent-chat-ui"
            target="_blank"
            className="flex items-center justify-center"
          >
            <GitHubSVG
              width="24"
              height="24"
            />
          </a>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Open GitHub repo</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function Thread() {
  const [artifactContext, setArtifactContext] = useArtifactContext();
  const [artifactOpen, closeArtifact] = useArtifactOpen();

  const [threadId, _setThreadId] = useQueryState("threadId");
  const [chatHistoryOpen, setChatHistoryOpen] = useQueryState(
    "chatHistoryOpen",
    parseAsBoolean.withDefault(true),
  );
  const [hideToolCalls, setHideToolCalls] = useQueryState(
    "hideToolCalls",
    parseAsBoolean.withDefault(false),
  );
  const [input, setInput] = useState("");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [firstTokenReceived, setFirstTokenReceived] = useState(false);
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");

  const stream = useStreamContext();
  const messages = stream.messages;
  const isLoading = stream.isLoading;

  // Fetch user's custom rules
  const { rules } = useTopSeenRules();

  const lastError = useRef<string | undefined>(undefined);

  const setThreadId = (id: string | null) => {
    _setThreadId(id);

    // close artifact and reset artifact context
    closeArtifact();
    setArtifactContext({});
  };

  useEffect(() => {
    if (!stream.error) {
      lastError.current = undefined;
      return;
    }
    try {
      const message = (stream.error as any).message;
      if (!message || lastError.current === message) {
        // Message has already been logged. do not modify ref, return early.
        return;
      }

      // Message is defined, and it has not been logged yet. Save it, and send the error
      lastError.current = message;
      toast.error("An error occurred. Please try again.", {
        description: (
          <p>
            <strong>Error:</strong> <code>{message}</code>
          </p>
        ),
        richColors: true,
        closeButton: true,
      });
    } catch {
      // no-op
    }
  }, [stream.error]);

  // TODO: this should be part of the useStream hook
  const prevMessageLength = useRef(0);
  useEffect(() => {
    if (
      messages.length !== prevMessageLength.current &&
      messages?.length &&
      messages[messages.length - 1].type === "ai"
    ) {
      setFirstTokenReceived(true);
    }

    prevMessageLength.current = messages.length;
  }, [messages]);

  const handleSubmit = (value: string, mood?: string) => {
    if (value.trim().length === 0 || isLoading)
      return;
    setFirstTokenReceived(false);

    // Apply mood to the message if selected
    const messageText = mood ? `[Mood: ${mood}] ${value}` : value;

    const newHumanMessage: Message = {
      id: uuidv4(),
      type: "human",
      content: [
        { type: "text", text: messageText }
      ] as Message["content"],
    };

    const toolMessages = ensureToolCallsHaveResponses(stream.messages);

    // Include custom rules in context
    const activeRules = rules.filter(rule => rule.isActive);
    const context = {
      ...(Object.keys(artifactContext).length > 0 ? artifactContext : {}),
      ...(activeRules.length > 0 && { topSeenRules: activeRules }),
    };

    stream.submit(
      { messages: [...toolMessages, newHumanMessage], context: Object.keys(context).length > 0 ? context : undefined },
      {
        streamMode: ["values"],
        optimisticValues: (prev) => ({
          ...prev,
          context: Object.keys(context).length > 0 ? context : undefined,
          messages: [
            ...(prev.messages ?? []),
            ...toolMessages,
            newHumanMessage,
          ],
        }),
      },
    );

    setInput("");
  };

  const handleMoodChange = (mood: string | null) => {
    setSelectedMood(mood);
  };

  const handleRegenerate = (
    parentCheckpoint: Checkpoint | null | undefined,
  ) => {
    // Do this so the loading state is correct
    prevMessageLength.current = prevMessageLength.current - 1;
    setFirstTokenReceived(false);
    stream.submit(undefined, {
      checkpoint: parentCheckpoint,
      streamMode: ["values"],
    });
  };

  const chatStarted = !!threadId || !!messages.length;
  const hasNoAIOrToolMessages = !messages.find(
    (m) => m.type === "ai" || m.type === "tool",
  );

  return (
    <div className="min-h-[calc(100vh-3.5rem)] w-full bg-muted/40 dark:bg-black/80">
      <div className="container max-w-7xl h-screen flex items-center justify-center w-full">

        {/* Main Card with Threads and Chat */}
        <Card className="flex h-[calc(100%-5rem)] w-full">
          {/* Threads Panel - Left Side */}
          <div className="hidden lg:flex w-80 border-r border-border bg-background rounded-l-lg">
            <ThreadHistory />
          </div>

          {/* Chat Panel - Right Side */}
          <div className="flex flex-col flex-1">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                Top Seen
                {messages.length > 0 && (
                  <span className="text-sm font-normal text-gray-500">
                    ({messages.length} messages)
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <Separator />

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Start a conversation
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md">
                    Slide into anyone's DMs with Cursor for Instagram
                  </p>
                </div>
              ) : (
                <>
                  {messages
                    .filter((m) => !m.id?.startsWith(DO_NOT_RENDER_ID_PREFIX))
                    .map((message, index) =>
                      message.type === "human" ? (
                        <HumanMessage
                          key={message.id || `${message.type}-${index}`}
                          message={message}
                          isLoading={isLoading}
                        />
                      ) : (
                        <AssistantMessage
                          key={message.id || `${message.type}-${index}`}
                          message={message}
                          isLoading={isLoading}
                          handleRegenerate={handleRegenerate}
                        />
                      ),
                    )}
                  {/* Special rendering case where there are no AI/tool messages, but there is an interrupt */}
                  {hasNoAIOrToolMessages && !!stream.interrupt && (
                    <AssistantMessage
                      key="interrupt-msg"
                      message={undefined}
                      isLoading={isLoading}
                      handleRegenerate={handleRegenerate}
                    />
                  )}
                  {isLoading && !firstTokenReceived && (
                    <AssistantMessageLoading />
                  )}
                </>
              )}
            </CardContent>

            {/* Input */}
            <div className="p-4">
              <PromptBox
                placeholder="Type your message..."
                disabled={isLoading}
                value={input}
                onChange={setInput}
                className="rounded-[8px]"
                onSubmit={handleSubmit}
                onMoodChange={handleMoodChange}
                additionalActions={
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setInput("");
                        setSelectedMood(null);
                      }}
                      disabled={isLoading}
                      className="flex h-6 w-6 items-center justify-center rounded-full text-black dark:text-gray-300 hover:text-gray-700 dark:hover:text-white transition-colors hover:bg-accent dark:hover:bg-[#515151] focus-visible:outline-none disabled:opacity-50"
                    >
                      <RefreshCcw className="h-4 w-4" />
                      <span className="sr-only">Clear chat</span>
                    </button>
                    {stream.isLoading && (
                      <button
                        type="button"
                        onClick={() => stream.stop()}
                        className="flex h-6 w-6 items-center justify-center rounded-full text-red-600 hover:text-red-700 transition-colors hover:bg-red-50 focus-visible:outline-none"
                      >
                        <CircleX className="h-4 w-4" />
                        <span className="sr-only">Stop generation</span>
                      </button>
                    )}
                  </>
                }
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Artifact Panel (keep if needed) */}
      {artifactOpen && (
        <div className="relative flex flex-col border-l w-[40vw] min-w-[300px]">
          <div className="absolute inset-0 flex flex-col">
            <div className="grid grid-cols-[1fr_auto] border-b p-4">
              <ArtifactTitle className="truncate overflow-hidden" />
              <button
                onClick={closeArtifact}
                className="cursor-pointer"
              >
                <XIcon className="size-5" />
              </button>
            </div>
            <ArtifactContent className="relative flex-grow" />
          </div>
        </div>
      )}
    </div>
  );
}
