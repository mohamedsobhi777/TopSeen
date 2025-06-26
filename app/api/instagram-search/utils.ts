import { Activity, ActivityTracker, InstagramAccount } from "./types";

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const combineAccounts = (accounts: InstagramAccount[]): string => {
  return accounts.map(account => 
    `Username: @${account.username}
Name: ${account.name}
Bio: ${account.bio}
Followers: ${account.followers.toLocaleString()}
Category: ${account.category}
Verified: ${account.verified ? 'Yes' : 'No'}
Source: ${account.source}
---`
  ).join('\n\n');
};

export const handleError = <T>(
  error: unknown, 
  context: string, 
  activityTracker?: ActivityTracker, 
  activityType?: Activity["type"], 
  fallbackReturn?: T
) => {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  
  if (activityTracker && activityType) {
    activityTracker.add(activityType, "error", `${context} failed: ${errorMessage}`);
  }
  
  return fallbackReturn;
};

export const extractInstagramData = (text: string): Partial<InstagramAccount>[] => {
  // Extract potential Instagram usernames from text
  const usernameRegex = /@([a-zA-Z0-9._]+)/g;
  const matches = text.match(usernameRegex);
  
  if (!matches) return [];
  
  return matches.map(match => ({
    username: match.replace('@', ''),
    source: 'extracted_from_content'
  }));
}; 