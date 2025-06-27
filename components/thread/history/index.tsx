import { Button } from "@/components/ui/button";
import { useThreads } from "@/providers/Thread";
import { Thread } from "@langchain/langgraph-sdk";
import { useEffect } from "react";

import { getContentString } from "../utils";
import { useQueryState, parseAsBoolean } from "nuqs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { PanelRightOpen, PanelRightClose, SquarePen } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

function ThreadList({
  threads,
  onThreadClick,
}: {
  threads: Thread[];
  onThreadClick?: (threadId: string) => void;
}) {
  const [threadId, setThreadId] = useQueryState("threadId");

  return (
    <div className="flex h-full w-full flex-col gap-1 overflow-y-auto p-2">
      {threads.map((t) => {
        let itemText = t.thread_id;
        if (
          typeof t.values === "object" &&
          t.values &&
          "messages" in t.values &&
          Array.isArray(t.values.messages) &&
          t.values.messages?.length > 0
        ) {
          const firstMessage = t.values.messages[0];
          itemText = getContentString(firstMessage.content);
        }
        
        const isCurrentThread = t.thread_id === threadId;
        
        return (
          <Button
            key={t.thread_id}
            variant={isCurrentThread ? "secondary" : "ghost"}
            className={`w-full justify-start text-left font-normal h-auto p-3 ${
              isCurrentThread ? "bg-secondary" : "hover:bg-secondary/50"
            }`}
            onClick={(e) => {
              e.preventDefault();
              onThreadClick?.(t.thread_id);
              if (t.thread_id === threadId) return;
              setThreadId(t.thread_id);
            }}
          >
            <div className="flex flex-col items-start gap-1 w-full">
              <p className="truncate text-ellipsis text-sm font-medium w-full">
                {itemText || "New conversation"}
              </p>
              <p className="text-xs text-muted-foreground">
                {/* You could add timestamp here if available */}
                {t.thread_id.slice(-8)}
              </p>
            </div>
          </Button>
        );
      })}
    </div>
  );
}

function ThreadHistoryLoading() {
  return (
    <div className="flex h-full w-full flex-col gap-1 overflow-y-auto p-2">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={`skeleton-${i}`} className="p-3">
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-3 w-16" />
        </div>
      ))}
    </div>
  );
}

export default function ThreadHistory() {
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  const [chatHistoryOpen, setChatHistoryOpen] = useQueryState(
    "chatHistoryOpen",
    parseAsBoolean.withDefault(true),
  );

  const { getThreads, threads, setThreads, threadsLoading, setThreadsLoading } =
    useThreads();

  useEffect(() => {
    if (typeof window === "undefined") return;
    setThreadsLoading(true);
    getThreads()
      .then(setThreads)
      .catch(console.error)
      .finally(() => setThreadsLoading(false));
  }, []);

  return (
    <>
      {/* Desktop - Always visible inside card */}
      <div className="hidden lg:flex flex-col h-full w-full">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Conversations</h2>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => window.location.href = '/thread'}
            className="h-8 w-8 p-0"
          >
            <SquarePen className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-hidden">
          {threadsLoading ? (
            <ThreadHistoryLoading />
          ) : threads.length > 0 ? (
            <ThreadList threads={threads} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <p className="text-sm text-muted-foreground mb-2">No conversations yet</p>
              <p className="text-xs text-muted-foreground">Start a new conversation to see it here</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile - Sheet overlay */}
      <Sheet
        open={!!chatHistoryOpen && !isLargeScreen}
        onOpenChange={(open) => {
          if (isLargeScreen) return;
          setChatHistoryOpen(open);
        }}
      >
        <SheetContent
          side="left"
          className="w-80"
        >
          <SheetHeader>
            <SheetTitle>Conversations</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            {threadsLoading ? (
              <ThreadHistoryLoading />
            ) : threads.length > 0 ? (
              <ThreadList
                threads={threads}
                onThreadClick={() => setChatHistoryOpen(false)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-center p-4">
                <p className="text-sm text-muted-foreground mb-2">No conversations yet</p>
                <p className="text-xs text-muted-foreground">Start a new conversation to see it here</p>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
