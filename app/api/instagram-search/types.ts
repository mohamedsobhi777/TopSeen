import { z } from "zod";

export interface InstagramAccount {
  id: string;
  username: string;
  name: string;
  bio: string;
  followers: number;
  following: number;
  posts: number;
  engagement_rate: number;
  category: string;
  verified: boolean;
  profilePictureUrl?: string;
  location?: string;
  website?: string;
  source: string;
}

export interface SearchState {
  query: string;
  completedSteps: number;
  tokenUsed: number;
  accounts: InstagramAccount[];
  processedUrls: Set<string>;
}

export interface ModelCallOptions<T> {
  prompt: string;
  system: string;
  schema?: z.ZodType<T>;
  activityType?: Activity["type"];
}

export interface SearchResult {
  title: string;
  url: string;
  content: string;
}

export interface Activity {
  type: 'search' | 'extract' | 'analyze' | 'planning';
  status: 'pending' | 'complete' | 'warning' | 'error';
  message: string;
  timestamp?: number;
}

export type ActivityTracker = {
  add: (type: Activity['type'], status: Activity['status'], message: Activity['message']) => void;
}; 