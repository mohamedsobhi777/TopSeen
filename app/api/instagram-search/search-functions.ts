// @ts-nocheck
import {
  ActivityTracker,
  InstagramAccount,
  SearchState,
  SearchResult,
} from "./types";
import { z } from "zod";
import {
  ANALYSIS_SYSTEM_PROMPT,
  EXTRACTION_SYSTEM_PROMPT,
  getAnalysisPrompt,
  getExtractionPrompt,
  getPlanningPrompt,
  PLANNING_SYSTEM_PROMPT,
} from "./prompts";
import { callModel } from "./model-caller";
import { exa } from "./services";
import { combineAccounts, handleError } from "./utils";
import {
  MAX_CONTENT_CHARS,
  MAX_ITERATIONS,
  MAX_SEARCH_RESULTS,
  MODEL_NAME,
} from "./constants";

export async function generateSearchQueries(
  searchState: SearchState,
  activityTracker: ActivityTracker
) {
  try {
    activityTracker.add("planning", "pending", "Planning Instagram search strategy");

    const result = await callModel(
      {
        prompt: getPlanningPrompt(searchState.query),
        system: PLANNING_SYSTEM_PROMPT,
        schema: z.object({
          searchQueries: z
            .array(z.string())
            .describe("Search queries to find Instagram accounts (max 3 queries)"),
        }),
        activityType: "planning"
      },
      searchState, 
      activityTracker
    );

    activityTracker.add("planning", "complete", "Created search strategy");

    return result;
  } catch (error) {
    return handleError(error, `Search planning`, activityTracker, "planning", {
      searchQueries: [
        `${searchState.query} Instagram accounts`,
        `${searchState.query} influencers`,
        `${searchState.query} Instagram users`
      ]
    });
  }
}

export async function search(
  query: string,
  searchState: SearchState,
  activityTracker: ActivityTracker
): Promise<SearchResult[]> {

  activityTracker.add("search", "pending", `Searching for: ${query}`);

  try {
    const searchResult = await exa.searchAndContents(query, {
      type: "keyword",
      numResults: MAX_SEARCH_RESULTS,
      startPublishedDate: new Date(
        Date.now() - 365 * 24 * 60 * 60 * 1000
      ).toISOString(),
      endPublishedDate: new Date().toISOString(),
      startCrawlDate: new Date(
        Date.now() - 365 * 24 * 60 * 60 * 1000
      ).toISOString(),
      endCrawlDate: new Date().toISOString(),
      includeDomains: [
        "instagram.com",
        "socialblade.com", 
        "influencermarketinghub.com",
        "klear.com",
        "upfluence.com",
        "hypeauditor.com"
      ],
      text: {
        maxCharacters: MAX_CONTENT_CHARS,
      },
    });

    const filteredResults = searchResult.results
      .filter((r) => r.title && r.text !== undefined)
      .map((r) => ({
        title: r.title || "",
        url: r.url,
        content: r.text || "",
      }));

    searchState.completedSteps++;

    activityTracker.add("search", "complete", `Found ${filteredResults.length} results for "${query}"`);

    return filteredResults;
  } catch (error) {
    console.log("Search error: ", error);
    return handleError(error, `Searching for ${query}`, activityTracker, "search", []) || [];
  }
}

export async function extractInstagramAccounts(
  content: string,
  url: string,
  searchQuery: string,
  searchState: SearchState,
  activityTracker: ActivityTracker
) {
  try {
    activityTracker.add("extract", "pending", `Extracting Instagram accounts from ${url}`);

    const result = await callModel(
      {
        prompt: getExtractionPrompt(content, searchQuery),
        system: EXTRACTION_SYSTEM_PROMPT,
        schema: z.object({
          accounts: z.array(z.object({
            username: z.string().describe("Instagram username without @"),
            name: z.string().describe("Display name"),
            bio: z.string().describe("Bio or description"),
            followers: z.number().describe("Follower count (estimate if not exact)"),
            category: z.string().describe("Category or niche"),
            verified: z.boolean().describe("Verification status"),
            engagement_rate: z.number().optional().describe("Engagement rate if available"),
            location: z.string().optional().describe("Location if mentioned"),
          }))
        }),
        activityType: "extract"
      },
      searchState, 
      activityTracker
    );

    activityTracker.add("extract", "complete", `Extracted ${(result as any).accounts.length} accounts from ${url}`);

    const accounts = (result as any).accounts.map((account: any) => ({
      id: account.username,
      username: account.username,
      name: account.name,
      bio: account.bio,
      followers: account.followers,
      following: 0, // Not available from search
      posts: 0, // Not available from search
      engagement_rate: account.engagement_rate || 0,
      category: account.category,
      verified: account.verified,
      location: account.location,
      source: url,
    }));

    return accounts;
  } catch (error) {
    return handleError(error, `Account extraction from ${url}`, activityTracker, "extract", []) || [];
  }
}

export async function processSearchResults(
  searchResults: SearchResult[],
  searchQuery: string,
  searchState: SearchState,
  activityTracker: ActivityTracker
): Promise<InstagramAccount[]> {
  const extractionPromises = searchResults.map((result) =>
    extractInstagramAccounts(result.content, result.url, searchQuery, searchState, activityTracker)
  );
  
  const extractionResults = await Promise.allSettled(extractionPromises);

  const newAccounts = extractionResults
    .filter(
      (result): result is PromiseFulfilledResult<InstagramAccount[]> =>
        result.status === "fulfilled" && result.value !== null
    )
    .map((result) => result.value)
    .flat();

  // Remove duplicates based on username
  const uniqueAccounts = newAccounts.filter((account, index, self) =>
    index === self.findIndex(a => a.username === account.username)
  );

  return uniqueAccounts;
}

export async function analyzeResults(
  searchState: SearchState,
  currentQueries: string[],
  currentIteration: number,
  activityTracker: ActivityTracker
) {
  try {
    activityTracker.add("analyze", "pending", `Analyzing search results (iteration ${currentIteration}/${MAX_ITERATIONS})`);
    
    const accountsText = combineAccounts(searchState.accounts);

    const result = await callModel(
      {
        prompt: getAnalysisPrompt(
          accountsText,
          searchState.query,
          currentQueries,
          currentIteration,
          MAX_ITERATIONS,
          searchState.accounts.length
        ),
        system: ANALYSIS_SYSTEM_PROMPT,
        schema: z.object({
          sufficient: z
            .boolean()
            .describe("Whether the found accounts are sufficient for the user's request"),
          gaps: z.array(z.string()).describe("Identified gaps in the results"),
          queries: z
            .array(z.string())
            .describe("Additional search queries if needed (max 2 queries)"),
        }),
        activityType: "analyze"
      },
      searchState, 
      activityTracker
    );

    const isSufficient = typeof result !== 'string' && result.sufficient;

    activityTracker.add("analyze", "complete", 
      `Analysis complete: ${isSufficient ? 'Results are sufficient' : 'Need more targeted search'}`);

    return result;
  } catch (error) {
    return handleError(error, `Results analysis`, activityTracker, "analyze", {
      sufficient: true, // Default to sufficient on error
      gaps: ["Unable to analyze results"],
      queries: []
    });
  }
} 