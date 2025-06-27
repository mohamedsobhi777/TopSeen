import { AIMessage, ToolMessage } from "@langchain/langgraph-sdk";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { ChevronDown, ChevronUp, Image, Link } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Tool Call Component - Shows the parameters being sent
export function InstagramSendMessageToolCall({ 
  toolCall 
}: { 
  toolCall: NonNullable<AIMessage["tool_calls"]>[0] 
}) {
  const { username, message } = toolCall.args as { username: string; message: string };

  return (
    <Card className="max-w-md border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-gray-900 text-sm font-medium">
          Instagram DM
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">To:</span>
          <Badge variant="outline" className="text-gray-700 border-gray-300">
            @{username}
          </Badge>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <p className="text-sm text-gray-700 leading-relaxed">{message}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// Tool Result Component - Shows the result of the action
export function InstagramSendMessageToolResult({ 
  message 
}: { 
  message: ToolMessage 
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  let resultData: any = {};
  
  try {
    if (typeof message.content === "string") {
      resultData = JSON.parse(message.content);
    } else {
      resultData = message.content;
    }
  } catch {
    resultData = { success: false, message: "Failed to parse result" };
  }

  const { success, message: resultMessage, direct_message_id, username } = resultData;
  
  const getStatusText = () => {
    if (success) return "Message sent";
    if (success === false) return "Message failed";
    return "Unknown status";
  };

  const getStatusClass = () => {
    if (success) return "text-green-700";
    if (success === false) return "text-red-700";
    return "text-yellow-700";
  };

  return (
    <Card className="max-w-md border-gray-200">
      <CardHeader 
        className="pb-3 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-900 font-medium">Message sent</span>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </motion.div>
        </div>
      </CardHeader>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: "hidden" }}
          >
            <CardContent className="space-y-3 pt-0">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Status:</span>
                <span className={`text-sm font-medium ${getStatusClass()}`}>
                  {getStatusText()}
                </span>
              </div>

              {username && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Recipient:</span>
                  <Badge variant="outline" className="text-gray-700 border-gray-300">
                    @{username}
                  </Badge>
                </div>
              )}

              {resultMessage && (
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-sm text-gray-700">{resultMessage}</p>
                </div>
              )}

              {direct_message_id && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600">Message ID:</span>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono text-gray-700">
                    {direct_message_id}
                  </code>
                </div>
              )}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

// Meme Context Protocol Tool Call Component
export function MemeContextProtocolToolCall({ 
  toolCall 
}: { 
  toolCall: NonNullable<AIMessage["tool_calls"]>[0] 
}) {
  const { prompt } = toolCall.args as { prompt: string };

  return (
    <Card className="max-w-md border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-gray-900 text-sm font-medium flex items-center gap-2">
          <Image className="h-4 w-4" />
          Generate Meme
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <p className="text-sm text-gray-700 leading-relaxed">{prompt}</p>
        </div>
      </CardContent>
    </Card>
  );
}
// Meme Context Protocol Tool Result Component
export function MemeContextProtocolToolResult({ 
  message 
}: { 
  message: ToolMessage 
}) {
  let imageUrl: string | null = null;
  
  try {
    if (typeof message.content === "string") {
      // Check if the content contains "Image URL:" pattern
      const urlMatch = message.content.match(/Image URL:\s*(.+)/);
      if (urlMatch && urlMatch[1]) {
        const fullUrl = urlMatch[1].trim();
        // Extract only the part after /public/
        const publicIndex = fullUrl.indexOf('/public/');
        if (publicIndex !== -1) {
          imageUrl = fullUrl.substring(publicIndex + '/public/'.length);
        } else {
          imageUrl = fullUrl;
        }
      }
    }
  } catch {
    // Failed to parse, imageUrl remains null
  }

  // If no image found, don't render anything
  if (!imageUrl) {
    return null;
  }

  return (
    <Card className="max-w-md border-gray-200">
      <CardContent className="p-3">
        <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-gray-600">Generated meme:</span>
          </div>
          <img 
            src={imageUrl} 
            alt="Generated meme" 
            className="w-full h-auto rounded max-h-64 object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}

// Instagram Send Photo Message Tool Call Component
export function InstagramSendPhotoMessageToolCall({ 
  toolCall 
}: { 
  toolCall: NonNullable<AIMessage["tool_calls"]>[0] 
}) {
  const { username, message, image_path } = toolCall.args as { username: string; message: string; image_path: string };

  return (
    <Card className="max-w-md border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-gray-900 text-sm font-medium flex items-center gap-2">
          <Image className="h-4 w-4" />
          Instagram Photo DM
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">To:</span>
          <Badge variant="outline" className="text-gray-700 border-gray-300">
            @{username}
          </Badge>
        </div>
        
        {image_path && (
          <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-gray-600">Photo:</span>
            </div>
            <img 
              src={image_path} 
              alt="Photo to send" 
              className="w-full h-auto rounded max-h-32 object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}

        {message && (
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <p className="text-sm text-gray-700 leading-relaxed">{message}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Instagram Send Photo Message Tool Result Component
export function InstagramSendPhotoMessageToolResult({ 
  message 
}: { 
  message: ToolMessage 
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  let resultData: any = {};
  
  try {
    if (typeof message.content === "string") {
      resultData = JSON.parse(message.content);
    } else {
      resultData = message.content;
    }
  } catch {
    resultData = { success: false, message: "Failed to parse result" };
  }

  const { success, message: resultMessage, direct_message_id, username } = resultData;
  
  const getStatusText = () => {
    if (success) return "Photo sent";
    if (success === false) return "Photo failed";
    return "Unknown status";
  };

  const getStatusClass = () => {
    if (success) return "text-green-700";
    if (success === false) return "text-red-700";
    return "text-yellow-700";
  };

  return (
    <Card className="max-w-md border-gray-200">
      <CardHeader 
        className="pb-3 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            <span className="text-sm text-gray-900 font-medium">Photo sent</span>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </motion.div>
        </div>
      </CardHeader>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: "hidden" }}
          >
            <CardContent className="space-y-3 pt-0">
              {/* <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Status:</span>
                <span className={`text-sm font-medium ${getStatusClass()}`}>
                  {getStatusText()}
                </span>
              </div> */}

              {username && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Recipient:</span>
                  <Badge variant="outline" className="text-gray-700 border-gray-300">
                    @{username}
                  </Badge>
                </div>
              )}

              {resultMessage && (
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-sm text-gray-700">{resultMessage}</p>
                </div>
              )}

              {/* {direct_message_id && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600">Message ID:</span>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono text-gray-700">
                    {direct_message_id}
                  </code>
                </div>
              )} */}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
} 