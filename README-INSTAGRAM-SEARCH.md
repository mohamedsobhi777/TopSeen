# Instagram Deep Search Feature

This feature allows users to search for Instagram accounts using natural language queries powered by AI and the Exa search API.

## Setup Required

### 1. Environment Variables

Add these environment variables to your `.env.local` file:

```bash
# Exa Search API Key - Required for Instagram account search
EXA_SEARCH_API_KEY=your_exa_search_api_key_here

# Anthropic API Key - Required for AI model calls using Claude
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

### 2. Get API Keys

**Exa Search API:**
1. Visit [exa.ai](https://exa.ai)
2. Sign up for an account
3. Get your API key from the dashboard

**Anthropic API:**
1. Visit [console.anthropic.com](https://console.anthropic.com)
2. Sign up for an account
3. Get your API key from the API keys section

## How It Works

1. **User Input**: Users enter natural language queries like "Find fashion influencers with 10K+ followers in Dubai"

2. **AI Planning**: The system uses AI to generate targeted search queries based on the user's request

3. **Web Search**: Uses Exa API to search across Instagram-related websites and directories

4. **Content Extraction**: AI extracts Instagram account information from search results

5. **Analysis**: AI analyzes results to determine if more searches are needed

6. **Display Results**: Shows found Instagram accounts with detailed information

## Features

- **Natural Language Queries**: Search using everyday language
- **Real-time Progress**: See search progress as it happens  
- **Account Details**: View usernames, follower counts, categories, verification status
- **Direct Actions**: Send messages or visit Instagram profiles
- **AI-Powered**: Uses Claude 3.5 Sonnet for intelligent search and extraction

## Example Queries

- "Find tech influencers with over 50K followers"
- "Beauty bloggers in Los Angeles who post daily"
- "Fitness coaches with high engagement rates"
- "Food influencers who review restaurants in New York"
- "Fashion brands with verified Instagram accounts"

## API Endpoints

- `POST /api/instagram-search` - Main search endpoint that streams results

## Components

- `InstagramSearchInterface` - Main search interface component
- `app/api/instagram-search/` - Backend search logic and API routes

## Technologies Used

- **Exa API** - Web search functionality
- **Anthropic Claude** - AI model for search planning, content extraction, and analysis
- **Next.js Streaming** - Real-time search progress
- **TypeScript** - Type safety and better development experience 