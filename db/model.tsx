const categoryEmoji = {
  Influencer: "⭐",
  Business: "💼",
  Personal: "👤",
  Celebrity: "🌟",
  Brand: "🏢",
  Creator: "🎨",
  Lifestyle: "✨",
  Fashion: "👗",
  Tech: "💻",
  Food: "🍗",
};

export const getCategoryEmoji = (category: string): string => {
  return categoryEmoji[category] || "👤";
};

export const gradientMap = {
  Influencer: "yellow",
  Business: "blue",
  Personal: "gray",
  Celebrity: "purple",
  Brand: "indigo",
  Creator: "pink",
  Lifestyle: "sky",
  Fashion: "rose",
  Tech: "green",
  Food: "orange",
};

export const getGradient = (category: string): string => {
  return gradientMap[category] || "gray";
};

export const gradientClassNameMap = {
  Influencer: "text-foreground bg-gradient-to-b from-yellow-300/40 dark:from-yellow-500 dark:text-yellow-50 text-yellow-900/70 to-yellow-200 dark:to-yellow-600",
  Business: "text-foreground bg-gradient-to-b from-blue-300/40 dark:from-blue-500 dark:text-blue-50 text-blue-900/70 to-blue-200 dark:to-blue-600",
  Personal: "text-foreground bg-gradient-to-b from-gray-300/40 dark:from-gray-500 dark:text-gray-50 text-gray-900/70 to-gray-200 dark:to-gray-600",
  Celebrity: "text-foreground bg-gradient-to-b from-purple-300/40 dark:from-purple-500 dark:text-purple-50 text-purple-900/70 to-purple-200 dark:to-purple-600",
  Brand: "text-foreground bg-gradient-to-b from-indigo-300/40 dark:from-indigo-500 dark:text-indigo-50 text-indigo-900/70 to-indigo-200 dark:to-indigo-600",
  Creator: "text-foreground bg-gradient-to-b from-pink-300/40 dark:from-pink-500 dark:text-pink-50 text-pink-900/70 to-pink-200 dark:to-pink-600",
  Lifestyle: "text-foreground bg-gradient-to-b from-sky-300/40 dark:from-sky-500 dark:text-sky-50 text-sky-900/70 to-sky-200 dark:to-sky-600",
  Fashion: "text-foreground bg-gradient-to-b from-rose-300/40 dark:from-rose-500 dark:text-rose-50 text-rose-900/70 to-rose-200 dark:to-rose-600",
  Tech: "text-foreground bg-gradient-to-b from-green-300/40 dark:from-green-500 dark:text-green-50 text-green-900/70 to-green-200 dark:to-green-600",
  Food: "text-foreground bg-gradient-to-b from-orange-300/40 dark:from-orange-500 dark:text-orange-50 text-orange-900/70 to-orange-200 dark:to-orange-600",
  Other: "bg-background",
};

export const gradientFillClassNameMap = {
  Influencer: "text-yellow-400",
  Business: "text-blue-500",
  Personal: "text-gray-500",
  Celebrity: "text-purple-500",
  Brand: "text-indigo-500",
  Creator: "text-pink-500",
  Lifestyle: "text-sky-500",
  Fashion: "text-rose-500",
  Tech: "text-green-500",
  Food: "text-orange-500",
  Other: "text-black",
};

export const getGradientClassName = (category: string): string => {
  return gradientClassNameMap[category] || "Other";
};

export const getGradientFillClassName = (category: string): string => {
  return gradientFillClassNameMap[category] || "Other";
};

// Instagram Profile Information
export interface InstagramProfile {
  username: string;
  displayName?: string;
  bio?: string;
  followerCount?: number;
  followingCount?: number;
  postCount?: number;
  profilePictureUrl?: string;
  isVerified?: boolean;
  isPrivate?: boolean;
  category?: string;
}

// Message/DM related interfaces
export interface DMMessage {
  id: string;
  profileId: string; // Links to InstagramAccount
  profileUsername: string;
  content: string;
  timestamp: string;
  isFromUser: boolean; // true if sent by us, false if received
  status: "sent" | "delivered" | "read" | "failed";
  messageType: "text" | "image" | "voice" | "sticker";
}

export interface DMConversation {
  id: string;
  profileId: string;
  profileUsername: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  isArchived: boolean;
  messages: DMMessage[];
}

// Updated main interface for Instagram accounts (replacing ChecklistItem)
export interface InstagramAccount {
  id: string;
  username: string; // Instagram username
  displayName?: string;
  profileId: string; // Our internal profile/campaign ID
  profileName: string; // Our campaign/profile name
  bio?: string;
  followerCount?: number;
  followingCount?: number;
  postCount?: number;
  profilePictureUrl?: string;
  isVerified?: boolean;
  isPrivate?: boolean;
  status: "pending" | "contacted" | "responded" | "ignored" | "blocked";
  createdAt: string;
  updatedAt: string;
  category?: string;
  priority: "low" | "medium" | "high";
  notes?: string;
  lastContactDate?: string;
  nextFollowUpDate?: string;
  reminderEnabled: boolean;
  reminderTime?: string | null;
  tags?: string[];
  createdBy: string;
  lastUpdatedBy: string;
  messageCount: number;
  lastMessageSent?: string;
  lastMessageReceived?: string;
  responseRate?: number; // Percentage of messages that got responses
  engagementScore?: number; // Custom scoring based on interactions
}

// Profile/Campaign list (replacing ItineraryList)
export interface ProfileCampaign {
  id: string;
  profileId: string;
  profileName: string; // Campaign name or target profile name
  description?: string;
  targetAudience?: string;
  messageTemplate?: string;
  isActive: boolean;
  createdAt: string;
  accountCount: number; // Number of IG accounts in this campaign
}

type InstagramAccountCategory =
  | "Influencer"
  | "Business" 
  | "Personal"
  | "Celebrity"
  | "Brand"
  | "Creator"
  | "Lifestyle"
  | "Fashion"
  | "Tech"
  | "Food";

// Message template for automated DMs
export interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  category: string;
  isActive: boolean;
  successRate?: number;
  responseRate?: number;
  createdAt: string;
  updatedAt: string;
}

// Search result interface for Instagram account discovery
export interface InstagramSearchResult {
  username: string;
  displayName?: string;
  bio?: string;
  followerCount?: number;
  followingCount?: number;
  postCount?: number;
  profilePictureUrl?: string;
  isVerified?: boolean;
  isPrivate?: boolean;
  category?: InstagramAccountCategory;
  matchScore?: number; // How well it matches the search query
}

// Instagram list interface for organizing accounts
export interface InstagramList {
  id: string;
  name: string;
  description?: string;
  query?: string; // Original search query that created this list
  isManual: boolean; // true for manually created lists, false for search-generated lists
  color?: string; // color theme for the list
  accountCount: number;
  createdAt: string;
  updatedAt: string;
}

// Instagram list item interface for many-to-many relationship between lists and accounts
export interface InstagramListItem {
  id: string;
  listId: string;
  accountId: string;
  addedAt: string;
  notes?: string;
}

// Extended interface for list items with populated account data
export interface InstagramListItemWithAccount extends InstagramListItem {
  account: InstagramAccount;
}

// Extended interface for lists with populated accounts
export interface InstagramListWithAccounts extends InstagramList {
  accounts: InstagramAccount[];
}

// Voice cloning interfaces
export interface VoiceClone {
  id: string;
  userId: string;
  name: string;
  status: "processing" | "ready" | "failed";
  audioFileName: string;
  audioFileUrl?: string;
  audioFileDuration?: number; // in seconds
  createdAt: string;
  updatedAt: string;
  isDefault: boolean;
  voiceModelId?: string; // External AI service model ID
  qualityScore?: number; // 0-100 quality rating
  trainingDataSize?: number; // Size of training data in MB
}

export interface VoiceSettings {
  userId: string;
  enableAudioMessages: boolean;
  defaultVoiceId?: string;
  voiceQuality: "standard" | "high" | "premium";
  speakingSpeed: "slow" | "normal" | "fast";
  audioFormat: "mp3" | "wav" | "m4a";
  maxAudioDuration: number; // seconds
  updatedAt: string;
}

export interface AudioMessage extends DMMessage {
  messageType: "voice";
  audioUrl: string;
  audioDuration: number; // in seconds
  voiceCloneId?: string; // Which voice clone was used
  transcription?: string; // Text version of the audio
  isGenerated: boolean; // true if AI-generated, false if recorded
}

// User account interface
export interface UserAccount {
  id: string;
  email: string;
  name?: string;
  profilePictureUrl?: string;
  subscription: "free" | "pro" | "enterprise";
  monthlyMessageLimit: number;
  currentMonthUsage: number;
  accountsLimit: number;
  currentAccountsCount: number;
  createdAt: string;
  lastLoginAt?: string;
  isActive: boolean;
  voiceSettings?: VoiceSettings;
  voiceClones?: VoiceClone[];
}
