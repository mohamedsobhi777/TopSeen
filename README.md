# TopSeen

**Cursor has changed the game for developers. What if we bring the same level of innovation to Instagram DMs?**

TopSeen is a revolutionary AI-powered platform that gives you a comprehensive toolkit for Instagram outreach and automation. Think of it as your intelligent assistant that understands Instagram, crafts personalized messages, and helps you connect with anyone in a snap.

## ✨ Core Features

### 🔍 **DeepSearch for Instagram Accounts**
Discover influencers, businesses, and creators with our AI-powered search engine. Simply describe what you're looking for in natural language:
- *"Find tech influencers with 50K+ followers who post about AI"*
- *"Beauty bloggers in Los Angeles with high engagement"*
- *"Sustainable fashion advocates with verified accounts"*

### 🤖 **Powerful AI Agent with Full Context**
Our intelligent agent understands your goals, remembers your preferences, and maintains context across conversations. It's like having a social media expert who never forgets.

### 🛠️ **MCP Servers & Super Powers**
Built on Model Context Protocol (MCP) with advanced capabilities:
- **Meme Generation**: Create engaging visual content automatically
- **Content Analysis**: Understand audience preferences and trends
- **Smart Personalization**: Craft messages that resonate
- **Multi-modal Processing**: Handle text, images, and audio seamlessly

### 📋 **Custom Rules & Instructions**
Define your communication style and the agent will remember it:
- Set your brand voice and tone
- Define your outreach strategy
- Establish approval workflows
- Create automated response patterns

### 💬 **Safe Chat Mode**
Chat with the AI without accidentally sending messages. Perfect for:
- Strategizing your outreach campaigns
- Crafting the perfect message
- Getting advice on engagement tactics
- Planning your content calendar

## 🚀 Coming Soon

### 🔄 **Background Agents**
Define automations that trigger automatically:
- Welcome new followers with personalized messages
- Respond to mentions and hashtags
- Follow up on unanswered messages
- Engage with trending content in your niche

### 🎙️ **Voice Cloning**
Clone your voice and send personalized audio messages at scale:
- Record a voice sample and create your AI voice clone
- Send authentic-sounding audio DMs automatically
- Maintain personal touch while scaling outreach
- Support for multiple languages and accents

## 🛠️ Tech Stack

**Frontend & Core:**
- **Framework:** [Next.js](https://nextjs.org/) with TypeScript
- **UI:** [React](https://reactjs.org/), [shadcn/ui](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/)
- **Database:** [RxDB](https://rxdb.info/) (offline-first, reactive database)
- **PWA:** Full offline support with service workers

**AI & Intelligence:**
- **AI Models:** [AI SDK](https://sdk.vercel.ai/docs) with Claude 3.5 Sonnet and GPT-4
- **Search Engine:** [Exa API](https://exa.ai) for web search and discovery
- **MCP Integration:** Model Context Protocol servers for advanced capabilities
- **Voice Processing:** Coming soon with advanced TTS/STT capabilities

**Developer Experience:**
- **Forms:** [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) validation
- **Package Manager:** [Bun](https://bun.sh/) for ultra-fast development
- **Code Quality:** ESLint, Prettier, TypeScript strict mode

## 🚀 Getting Started

### Prerequisites

Make sure you have these installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Bun](https://bun.sh/) (recommended package manager)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/topseen.git
   cd topseen
   ```

2. **Install dependencies:**
   ```bash
   bun install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory:
   ```bash
   # AI Models
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   OPENAI_API_KEY=your_openai_api_key_here
   
   # Search & Discovery
   EXA_SEARCH_API_KEY=your_exa_search_api_key_here
   
   # Instagram Integration (Optional)
   INSTAGRAM_USERNAME=your_instagram_username
   INSTAGRAM_PASSWORD=your_instagram_password
   ```

### Running the Application

**Development mode:**
```bash
bun run dev
```

**Production build:**
```bash
bun run build
bun run start
```

Open [http://localhost:3000](http://localhost:3000) to start using TopSeen.

## 📚 Available Scripts

- **`bun run dev`** - Start development server with hot reload
- **`bun run build`** - Create optimized production build
- **`bun run start`** - Start production server
- **`bun run lint`** - Run ESLint for code quality checks
- **`bun run type-check`** - Run TypeScript compiler checks

## 🎯 Use Cases

**For Influencer Marketing:**
- Discover micro-influencers in your niche
- Automate outreach campaigns
- Track engagement and response rates
- Scale personalized communication

**For Content Creators:**
- Find collaboration opportunities
- Network with industry peers
- Automate follower engagement
- Grow your audience strategically

**For Brands & Agencies:**
- Identify brand ambassadors
- Manage multiple client campaigns
- Automate customer support
- Scale social media operations

## 🔐 Privacy & Security

- **Local-first**: All data stored locally with RxDB
- **Encrypted Communication**: End-to-end encryption for sensitive data
- **Compliance Ready**: GDPR and privacy-focused design
- **Rate Limiting**: Intelligent throttling to respect platform limits

## 📖 Documentation

For detailed documentation on specific features:
- [Instagram DeepSearch Guide](./README-INSTAGRAM-SEARCH.md)
- [MCP Server Integration](./docs/mcp-servers.md) *(coming soon)*
- [Background Agents Setup](./docs/background-agents.md) *(coming soon)*
- [Voice Cloning Guide](./docs/voice-cloning.md) *(coming soon)*

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

**Ready to revolutionize your Instagram outreach?** Get started with TopSeen and experience the future of social media automation. 🚀
