import { generateObject, generateText } from "ai";
import { claudeModel } from "./services";
import { ActivityTracker, ModelCallOptions, SearchState } from "./types";
import { MAX_RETRY_ATTEMPTS, RETRY_DELAY_MS } from "./constants";
import { delay } from "./utils";

export async function callModel<T>({
  prompt, 
  system, 
  schema, 
  activityType = "search"
}: ModelCallOptions<T>,
searchState: SearchState,
activityTracker: ActivityTracker): Promise<T | string> {

  let attempts = 0;
  let lastError: Error | null = null;

  while (attempts < MAX_RETRY_ATTEMPTS) {
    try {
      if (schema) {
        const { object, usage } = await (generateObject as any)({
          model: claudeModel,
          prompt,
          system,
          schema: schema
        });

        searchState.tokenUsed += usage.totalTokens;
        searchState.completedSteps++;

        return object;
      } else {
        const { text, usage } = await (generateText as any)({
          model: claudeModel,
          prompt,
          system,
        });

        searchState.tokenUsed += usage.totalTokens;
        searchState.completedSteps++;

        return text;
      }
    } catch (error) {
      attempts++;
      lastError = error instanceof Error ? error : new Error('Unknown error');

      if (attempts < MAX_RETRY_ATTEMPTS) {
        activityTracker.add(activityType, 'warning', `Model call failed, attempt ${attempts}/${MAX_RETRY_ATTEMPTS}. Retrying...`);
      }
      await delay(RETRY_DELAY_MS * attempts);
    }
  }

  throw lastError || new Error(`Failed after ${MAX_RETRY_ATTEMPTS} attempts!`);
} 