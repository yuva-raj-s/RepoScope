# RepoScope

## Overview

RepoScope is an AI-powered GitHub repository analyzer that provides intelligent summaries and insights about any public GitHub repository. Users enter a GitHub repository URL, and the application fetches repository metadata, file structure, and key files, then uses Google's Gemini AI to generate a comprehensive analysis including project purpose, architecture overview, technology stack detection, and key insights.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast HMR and optimized production builds
- Wouter for lightweight client-side routing (single-page application with `/` home route)
- React Query (@tanstack/react-query) for server state management and API caching

**UI Component System**
- shadcn/ui component library with Radix UI primitives for accessible, composable components
- Tailwind CSS for utility-first styling with custom design tokens
- Custom design system following GitHub/Linear/VS Code patterns for developer familiarity
- Dark mode support with theme toggle using localStorage persistence

**State Management Pattern**
- Server state managed via React Query with mutations for API calls
- Local UI state managed with React hooks (useState for analysis progress and results)
- Form state handled by react-hook-form with Zod schema validation

**Key UI Components**
- `RepositoryInput`: GitHub URL input with validation and example repository quick-start links
- `AnalysisProgress`: Multi-stage progress indicator (fetching → scanning → analyzing → complete)
- `AnalysisResults`: Tabbed interface displaying repository metadata, AI analysis, file tree, and README
- `FileTree`: Recursive component for collapsible directory visualization
- `TechnologyBadges`: Categorized technology stack display with color-coded badges

### Backend Architecture

**Server Framework**
- Express.js for HTTP server and API routing
- TypeScript for type safety across the full stack
- Custom development server with Vite integration for HMR in development

**API Design**
- RESTful endpoint: `POST /api/analyze` accepts GitHub repository URL
- Request validation using Zod schemas shared between client and server
- Response includes full repository analysis with metadata, file tree, README, and AI insights

**GitHub Integration Flow**
1. Parse and validate GitHub URL format
2. Fetch repository metadata from GitHub API (stars, forks, language, topics)
3. Retrieve complete file tree structure via GitHub Contents API
4. Download README content when available
5. Identify and fetch key configuration files (package.json, tsconfig.json, etc.)

**AI Analysis Pipeline**
- Google Gemini AI (gemini-2.5-flash or gemini-2.5-pro models) for repository analysis
- Structured prompts combining repository metadata, file structure, and key file contents
- AI generates: project overview, purpose statement, architecture description, key features list, technology detection with confidence scores, and actionable insights
- Technology categorization: frontend, backend, database, devops, testing, other

**Error Handling Strategy**
- GitHub API rate limiting detection with user-friendly error messages
- Repository not found (404) handling
- Invalid URL format validation before API calls
- Gemini API key validation with clear configuration error messages

### Data Storage

**Current Implementation**
- In-memory storage only (no persistence between server restarts)
- Database schema defined using Drizzle ORM with PostgreSQL dialect
- Database configuration prepared but not actively used (ready for future persistence)

**Session Management**
- Express session middleware configured
- connect-pg-simple for potential PostgreSQL session storage
- Currently operates statelessly (no user authentication)

### Build & Deployment

**Development Mode**
- Vite middleware integrated into Express for live client reloading
- Server runs with tsx for TypeScript execution without compilation
- Hot module replacement (HMR) via WebSocket connection on `/vite-hmr`

**Production Build Process**
1. Vite builds optimized client bundle to `dist/public`
2. esbuild bundles server code with selective dependency bundling
3. Allowlist of dependencies bundled to reduce cold start syscalls
4. External dependencies loaded from node_modules in production

**Environment Variables**
- `GEMINI_API_KEY`: Required for AI analysis functionality
- `DATABASE_URL`: Configured for PostgreSQL connection (optional in current implementation)
- `NODE_ENV`: Determines development vs production behavior

## External Dependencies

### AI Services
- **Google Gemini API**: Core AI analysis engine using `@google/genai` SDK
  - Model: gemini-2.5-flash (primary)
  - Used for repository content analysis and technology detection
  - Requires GEMINI_API_KEY secret
  - Falls back to basic pattern-based analysis if API unavailable

### Third-Party APIs
- **GitHub REST API v3**: Repository data fetching
  - Unauthenticated public API access
  - Rate limiting: 60 requests/hour per IP
  - Endpoints: repository metadata, contents/tree, README retrieval

### Database (Configured but Optional)
- **PostgreSQL**: Configured via Neon serverless driver (@neondatabase/serverless)
- **Drizzle ORM**: Type-safe database queries and migrations
- Schema defined in `shared/schema.ts`
- Migrations output to `./migrations` directory

### UI Component Libraries
- **Radix UI**: Headless accessible component primitives (20+ components imported)
- **shadcn/ui**: Pre-styled component system built on Radix
- **Tailwind CSS**: Utility-first CSS framework with custom theme

### Development Tools
- **Replit Integration**: 
  - Vite plugins for cartographer and dev banner in Replit environment
  - Runtime error overlay modal for development
- **TypeScript**: Full-stack type safety with shared schemas
- **Zod**: Runtime schema validation for API requests and responses

### Build Dependencies
- **Vite**: Frontend build tool and dev server
- **esbuild**: Server-side bundling for production
- **PostCSS & Autoprefixer**: CSS processing pipeline