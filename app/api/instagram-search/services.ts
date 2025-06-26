import { anthropic } from "@ai-sdk/anthropic";
import Exa from "exa-js";

export const exa = new Exa(process.env.EXA_SEARCH_API_KEY || "");

export const claudeModel = anthropic("claude-3-5-sonnet-20241022"); 