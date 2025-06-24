# TopSeen

TopSeen is a SaaS platform designed to help you find Instagram accounts for your marketing campaigns. You can search for influencers, businesses, and creators based on your specific needs.

## Features

- **Advanced Search:** Find Instagram accounts with powerful search queries.
- **Command Suggestions:** Get suggestions for popular search queries.
- **Filtering:** Filter results based on various criteria to narrow down your search.
- **Analytics:** Get insights into the accounts you find.
- **File Upload:** Upload your own lists of accounts to analyze.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **UI:** [React](https://reactjs.org/), [shadcn/ui](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/)
- **Database:** [RxDB](https://rxdb.info/) (an offline-first, reactive database)
- **AI:** [AI SDK](https://sdk.vercel.ai/docs) for OpenAI and Anthropic models.
- **Forms:** [React Hook Form](https://react-hook-form.com/)
- **Schema Validation:** [Zod](https://zod.dev/)
- **PWA:** Enabled for offline support.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have [Node.js](https://nodejs.org/) and [Bun](https://bun.sh/) installed on your machine.

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/topseen.git
   ```
2. Navigate to the project directory:
   ```sh
   cd topseen
   ```
3. Install the dependencies:
   ```sh
   bun install
   ```

### Running the Application

To run the application in development mode, execute the following command:

```sh
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

In the project directory, you can run the following commands:

- `bun run dev`: Runs the app in the development mode.
- `bun run build`: Builds the app for production.
- `bun run start`: Starts a production server.
- `bun run lint`: Runs the linter to check for code quality.
