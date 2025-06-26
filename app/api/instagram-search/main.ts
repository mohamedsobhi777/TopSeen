
import { createActivityTracker } from "./activity-tracker";
import { MAX_ITERATIONS } from "./constants";
import { analyzeResults, generateSearchQueries, processSearchResults, search } from "./search-functions";
import { SearchState } from "./types";

export async function instagramSearch(searchState: SearchState, dataStream: any) {
  let iteration = 0;
  
  const activityTracker = createActivityTracker(dataStream, searchState);

  // Generate initial search queries
  const initialQueries = await generateSearchQueries(searchState, activityTracker);
  let currentQueries = (initialQueries as any).searchQueries;

  while (currentQueries && currentQueries.length > 0 && iteration < MAX_ITERATIONS) {
    iteration++;

    console.log("Running search iteration: ", iteration);

    // Execute searches in parallel
    const searchPromises = currentQueries.map((query: string) => 
      search(query, searchState, activityTracker)
    );
    const searchResults = await Promise.allSettled(searchPromises);

    // Combine all successful search results
    const allSearchResults = searchResults
      .filter((result): result is PromiseFulfilledResult<any> => 
        result.status === 'fulfilled' && result.value.length > 0
      )
      .map(result => result.value)
      .flat();

    console.log(`Found ${allSearchResults.length} search results!`);

    if (allSearchResults.length === 0) {
      console.log("No search results found, breaking loop");
      break;
    }

    // Process search results to extract Instagram accounts
    const newAccounts = await processSearchResults(
      allSearchResults, 
      searchState.query,
      searchState, 
      activityTracker
    );

    console.log(`Extracted ${newAccounts.length} Instagram accounts`);

    // Add new accounts to search state (avoiding duplicates)
    const existingUsernames = new Set(searchState.accounts.map(acc => acc.username));
    const uniqueNewAccounts = newAccounts.filter(acc => !existingUsernames.has(acc.username));
    
    searchState.accounts = [...searchState.accounts, ...uniqueNewAccounts];

    // Stream partial results as they come in
    if (uniqueNewAccounts.length > 0) {
      dataStream.writeData({
        type: "partial-results",
        content: {
          accounts: searchState.accounts,
          totalAccounts: searchState.accounts.length,
          newAccounts: uniqueNewAccounts.length,
          query: searchState.query,
          iteration: iteration
        }
      });
    }

    // Analyze if we have sufficient results
    const analysis = await analyzeResults(
      searchState,
      currentQueries,
      iteration,
      activityTracker
    );

    console.log("Analysis result: ", analysis);

    // If we have sufficient results, break the loop
    if ((analysis as any).sufficient) {
      console.log("Analysis indicates sufficient results found");
      break;
    }

    // Get new queries for next iteration, filtering out already used ones
    currentQueries = ((analysis as any).queries || [])
      .filter((query: string) => !currentQueries.includes(query));
  }

  console.log(`Search completed after ${iteration} iterations with ${searchState.accounts.length} accounts found`);

  // Send final results
  console.log('Sending final results with', searchState.accounts.length, 'accounts');
  dataStream.writeData({
    type: "results",
    content: {
      accounts: searchState.accounts,
      totalAccounts: searchState.accounts.length,
      query: searchState.query,
      iterations: iteration,
      tokensUsed: searchState.tokenUsed
    }
  });

  return searchState.accounts;
} 