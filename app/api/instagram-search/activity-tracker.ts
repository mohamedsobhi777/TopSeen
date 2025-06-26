
import { Activity, SearchState } from './types';

export const createActivityTracker = (dataStream: any, searchState: SearchState) => {
  return {
    add: (type: Activity['type'], status: Activity['status'], message: Activity['message']) => {
      dataStream.writeData({
        type: "activity",
        content: {
          type,
          status,
          message, 
          timestamp: Date.now(),
          completedSteps: searchState.completedSteps,
          tokenUsed: searchState.tokenUsed
        }
      });
    }
  };
}; 