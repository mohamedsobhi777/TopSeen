import { AIMessage, ToolMessage } from "@langchain/langgraph-sdk";
import {
  InstagramSendMessageToolCall,
  InstagramSendMessageToolResult,
  InstagramSendPhotoMessageToolCall,
  InstagramSendPhotoMessageToolResult,
  MemeContextProtocolToolCall,
  MemeContextProtocolToolResult
} from "./instagram-dm-components";

// Registry for custom tool call components
const customToolCallComponents: Record<string, React.ComponentType<any>> = {
  "mcp__instagram_dms__send_message": InstagramSendMessageToolCall,
  "mcp__instagram_dms__send_photo_message": () => null,
  "mcp__hf-mcp-server__gr3_agents_mcp_hackathon_meme_context_protocol": () => null,
};

// Registry for custom tool result components  
const customToolResultComponents: Record<string, React.ComponentType<any>> = {
  "mcp__instagram_dms__send_message": InstagramSendMessageToolResult,
  "mcp__instagram_dms__send_photo_message": InstagramSendPhotoMessageToolResult,
  "mcp__hf-mcp-server__gr3_agents_mcp_hackathon_meme_context_protocol": MemeContextProtocolToolResult,
};

// Helper functions to check if custom components exist
export function hasCustomToolCallComponent(toolName: string): boolean {
  return toolName in customToolCallComponents;
}

export function hasCustomToolResultComponent(toolName: string): boolean {
  return toolName in customToolResultComponents;
}

// Helper functions to get custom components
export function getCustomToolCallComponent(toolName: string): React.ComponentType<any> | null {
  return customToolCallComponents[toolName] || null;
}

export function getCustomToolResultComponent(toolName: string): React.ComponentType<any> | null {
  return customToolResultComponents[toolName] || null;
} 