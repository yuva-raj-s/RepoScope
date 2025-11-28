# 🔍 RepoScope

> AI-powered GitHub repository analyzer that provides intelligent summaries, architecture insights, and comprehensive technical analysis of any public GitHub repository.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Built with React](https://img.shields.io/badge/Built%20with-React%2018-blue.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

---

## ✨ Features

- **Multi-Provider AI Support** - Choose from Google Gemini, OpenAI, Anthropic Claude, or Cohere
- **Comprehensive Repository Analysis** - Get detailed insights on purpose, architecture, and technology stack
- **Smart Technology Detection** - Automatically categorizes tech stack with confidence levels
- **Visual File Structure** - Browse interactive repository file tree
- **README Preview** - View project documentation directly
- **Export Capabilities** - Download analysis as Markdown or JSON
- **Dark Mode Support** - Beautiful dark and light theme toggle
- **Client-Side API Keys** - Manage your own API keys securely with localStorage (no server-side storage)
- **Real-time Progress** - Multi-stage progress tracking during analysis

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- An API key from at least one of: [Google Gemini](https://ai.google.dev), [OpenAI](https://openai.com), [Anthropic Claude](https://claude.ai), or [Cohere](https://cohere.com)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/repoScope.git
   cd repoScope
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5000
   ```

### Configuration

Upon first visit, you'll see a welcome screen. Click **"Get Started"** to:
1. Select your preferred AI provider
2. Enter your API key (stored securely in localStorage)
3. Start analyzing repositories

**API Keys are stored locally** - they never touch our servers. You maintain full control of your credentials.

---

## 📖 How to Use

1. **Enter Repository URL** - Paste any public GitHub repository URL (e.g., `https://github.com/facebook/react`)

2. **Review the Analysis** - Watch as RepoScope:
   - Fetches repository metadata
   - Analyzes file structure
   - Scans key configuration files
   - Runs AI analysis

3. **Explore Results** - Navigate through tabs:
   - **Overview** - Repository metadata and statistics
   - **Analysis** - AI-generated insights on purpose, architecture, and features
   - **Technologies** - Detected tech stack with confidence levels
   - **File Tree** - Interactive repository structure
   - **README** - Original project documentation

4. **Export & Share**
   - Copy repository URL to clipboard
   - Export full analysis as Markdown
   - Export raw data as JSON
   - Share analysis link with others

---

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI framework with hooks
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality component library
- **Wouter** - Lightweight routing
- **React Query** - Server state management
- **React Hook Form** - Form handling with validation
- **Lucide React** - Beautiful icon library

### Backend
- **Express.js** - Minimal HTTP server
- **TypeScript** - Full-stack type safety
- **GitHub REST API** - Repository data fetching
- **Drizzle ORM** - Type-safe database queries
- **Zod** - Runtime schema validation

### AI Services
- **Google Gemini 2.5** - Primary AI analysis engine
- **OpenAI GPT-4 Mini** - Alternative provider
- **Anthropic Claude 3.5** - Enterprise-grade analysis
- **Cohere** - Additional AI option

---

## 📊 Analysis Details

RepoScope generates professional technical analysis including:

### Overview
Concise 2-3 sentence summary of the repository's purpose and value proposition

### Purpose
Detailed explanation of what problem the project solves and its target audience

### Architecture
Comprehensive description of:
- Organizational structure and design patterns
- Major components and their interactions
- Separation of concerns (frontend/backend/database)
- Code organization approach

### Key Features
- Primary capabilities and features
- Notable functionality
- What makes the project unique

### Technology Stack
Detected technologies categorized by role:
- **Frontend** - UI frameworks, CSS, bundlers
- **Backend** - Servers, APIs, frameworks
- **Database** - Data stores, ORMs
- **DevOps** - CI/CD, containers, cloud
- **Testing** - Test frameworks and tools
- **Other** - Utilities and tools

### Insights
- Project maturity assessment
- Code quality observations
- Best practices identified
- Scalability considerations
- Security and architecture notes

---

## 🔑 API Key Setup

### Google Gemini
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikeys)
2. Click "Get API Key"
3. Create new API key
4. Copy and paste into RepoScope

### OpenAI
1. Visit [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Click "Create new secret key"
3. Copy the key (you won't see it again)
4. Paste into RepoScope

### Anthropic Claude
1. Go to [Anthropic Console](https://console.anthropic.com)
2. Navigate to API keys
3. Create new API key
4. Copy and paste into RepoScope

### Cohere
1. Visit [Cohere Dashboard](https://dashboard.cohere.com/api-keys)
2. Create new API key
3. Copy and paste into RepoScope

---

## 🔒 Privacy & Security

- **Local Storage Only** - API keys are stored in your browser's localStorage
- **No Server Storage** - We don't store, log, or transmit your API keys
- **No Data Collection** - Repository analyses are not saved server-side
- **Client-Side Processing** - All analysis logic runs on your machine
- **Public Data Only** - Analyzes only public GitHub repositories

---

## 📱 Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## 🧪 Development

### Project Structure
```
├── client/
│   ├── src/
│   │   ├── pages/          # Page components (Home, Welcome)
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utilities and helpers
│   │   └── App.tsx         # Root component
│   └── index.html
├── server/
│   ├── routes.ts           # API endpoints
│   ├── ai-providers.ts     # AI service integrations
│   ├── github.ts           # GitHub API client
│   └── vite.ts             # Vite dev server setup
├── shared/
│   ├── schema.ts           # Type-safe data schemas
│   └── api-schema.ts       # API request/response schemas
└── package.json
```

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npx tsc --noEmit
```

### Building Locally
```bash
npm install
npm run build
npm run preview
```

---

## 🚀 Deployment

### Deploy to Replit
1. Push code to GitHub
2. Import project into Replit
3. Click "Deploy"
4. Set environment variable: `GEMINI_API_KEY` (optional - users provide their own)

### Deploy to Vercel
```bash
vercel deploy
```

### Deploy to Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

---

## 📝 Environment Variables

Optional environment variables for server-side functionality:

```env
# Optional: Pre-configured API keys (not recommended for security)
GEMINI_API_KEY=your_gemini_key
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_claude_key
COHERE_API_KEY=your_cohere_key

# Database (if using persistence)
DATABASE_URL=postgresql://...
```

**Note**: Users should configure their own API keys through the UI instead of using environment variables.

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/repoScope.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Follow existing code style
   - Add TypeScript types for all code
   - Update README if needed

4. **Test locally**
   ```bash
   npm run dev
   ```

5. **Commit and push**
   ```bash
   git add .
   git commit -m "Add amazing feature"
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**
   - Describe your changes clearly
   - Link any related issues
   - Request review from maintainers

### Development Guidelines
- Use TypeScript for all code
- Keep components small and focused
- Write meaningful commit messages
- Test changes before submitting PR
- Update documentation as needed

---

## 🐛 Issues & Feedback

Found a bug or have a feature request?

- **Report Issues**: [GitHub Issues](https://github.com/yourusername/repoScope/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/repoScope/discussions)
- **Email**: [contact@example.com]

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Radix UI](https://www.radix-ui.com/) - Accessible component primitives
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful component system
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [GitHub API](https://docs.github.com/en/rest) - Repository data
- [Google Gemini](https://ai.google.dev/) - AI analysis engine

---

## 📈 Roadmap

- [ ] Dark mode enhancements
- [ ] Repository comparison tool
- [ ] Team/organization analysis
- [ ] Advanced filtering and search
- [ ] Custom analysis prompts
- [ ] Analysis history and favorites
- [ ] API endpoint for programmatic access
- [ ] Chrome/Firefox extension
- [ ] Mobile app

---

## 💬 Support

Need help? Here are some resources:

- **Documentation** - [See README.md](README.md)
- **GitHub Issues** - [Report bugs](https://github.com/yourusername/repoScope/issues)
- **Discussions** - [Ask questions](https://github.com/yourusername/repoScope/discussions)

---

<div align="center">

**Made with ❤️ by [Your Name]**

[⬆ back to top](#-repoScope)

</div>
