import { AIMessage, ToolMessage } from "@langchain/langgraph-sdk";
import { InstagramSendMessageToolCall, InstagramSendMessageToolResult } from "./instagram-dm-components";

// Tool Call Component Map
const TOOL_CALL_COMPONENTS: Record<string, React.ComponentType<{ toolCall: NonNullable<AIMessage["tool_calls"]>[0] }>> = {
  "mcp__instagram_dms__send_message": InstagramSendMessageToolCall,
  // Add more custom tool call components here
};

// Tool Result Component Map  
const TOOL_RESULT_COMPONENTS: Record<string, React.ComponentType<{ message: ToolMessage }>> = {
  "mcp__instagram_dms__send_message": InstagramSendMessageToolResult,
  // Add more custom tool result components here
};

// Function to get custom tool call component
export function getCustomToolCallComponent(toolName: string) {
  return TOOL_CALL_COMPONENTS[toolName];
}

// Function to get custom tool result component
export function getCustomToolResultComponent(toolName: string) {
  return TOOL_RESULT_COMPONENTS[toolName];
}

// Function to check if a tool has a custom component
export function hasCustomToolCallComponent(toolName: string): boolean {
  return toolName in TOOL_CALL_COMPONENTS;
}

// Function to check if a tool result has a custom component
export function hasCustomToolResultComponent(toolName: string): boolean {
  return toolName in TOOL_RESULT_COMPONENTS;
} 