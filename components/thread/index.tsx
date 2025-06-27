import { v4 as uuidv4 } from "uuid";
import { useEffect, useRef, useMemo } from "react";
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
  const [selectedMode, setSelectedMode] = useState<string | null>("agentMode");

  const { rules } = useTopSeenRules();

  const [input, setInput] = useState<string>("");
  const [firstTokenReceived, setFirstTokenReceived] = useState(false);
  const prevMessageLength = useRef(0);

  const [artifactContext, setArtifactContext] = useArtifactContext();
  const [artifactOpen, closeArtifact] = useArtifactOpen();

  const stream = useStreamContext();
  const messages = stream.messages;
  const isLoading = stream.isLoading;

  useEffect(() => {
    // If we've received messages and this is the first time (loading just finished)
    if (
      prevMessageLength.current === 0 &&
      messages?.length &&
      messages[messages.length - 1].type === "ai"
    ) {
      setFirstTokenReceived(true);
    }

    prevMessageLength.current = messages.length;
  }, [messages]);

  const handleSubmit = (value: string, mode?: string) => {
    if (value.trim().length === 0 || isLoading)
      return;
    setFirstTokenReceived(false);

    const newHumanMessage: Message = {
      id: uuidv4(),
      type: "human",
      content: [
        { type: "text", text: value }
      ] as Message["content"],
    };

    const toolMessages = ensureToolCallsHaveResponses(stream.messages);

    // Include custom rules and mode in context
    const activeRules = rules.filter(rule => rule.isActive);
    const context = {
      ...(Object.keys(artifactContext).length > 0 ? artifactContext : {}),
      ...(activeRules.length > 0 && { topSeenRules: activeRules }),
      ...(mode && { mode: mode }), // Add mode to context
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
        config: {
          configurable: {
            mode,
            rulesList: activeRules.map(rule => rule.description),
          }
        }
      },
    );

    setInput("");
  };

  const handleModeChange = (mode: string | null) => {
    setSelectedMode(mode);
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

  // const chatStarted = !!stream.threadId || !!messages.length;
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
            <CardContent className="flex-1 overflow-y-auto h-full p-4 space-y-4 flex flex-col">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Start a conversation
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md">
                    Slide into anyone&apos;s DMs with Cursor for Instagram
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
                onModeChange={handleModeChange}
                additionalActions={
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setInput("");
                        setSelectedMode("agentMode");
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
