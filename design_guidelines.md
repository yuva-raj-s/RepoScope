# RepoScope Design Guidelines

## Design Approach
**Selected Approach**: Design System with Developer-Focused References  
**Primary References**: GitHub's interface patterns, Linear's typography, VS Code's information hierarchy  
**Rationale**: As a technical analysis tool for developers, familiarity and clarity trump visual experimentation. Users need efficient information access and professional presentation.

## Core Design Elements

### Typography
- **Primary Font**: Inter via Google Fonts CDN
- **Monospace Font**: JetBrains Mono for code, file paths, and technical identifiers
- **Hierarchy**:
  - Hero/Page Title: text-4xl font-bold
  - Section Headers: text-2xl font-semibold
  - Subsection Headers: text-xl font-medium
  - Body Text: text-base
  - Code/Technical: text-sm font-mono
  - Metadata/Labels: text-xs uppercase tracking-wide

### Layout System
**Spacing Primitives**: Use Tailwind units of 3, 4, 6, 8, 12, 16
- Component padding: p-4 to p-6
- Section spacing: py-12 to py-16
- Card/container gaps: gap-6 to gap-8
- Max content width: max-w-6xl for main container

### Component Library

**Input Section**:
- Large, prominent URL input field with GitHub icon prefix
- "Analyze Repository" CTA button (primary action)
- Input validation with inline error states
- Example repository links as quick-start options below input

**Analysis Display Layout**:
- Two-column desktop layout (lg:grid-cols-3):
  - Left sidebar (1 col): Repository metadata, quick stats, detected technologies
  - Main content (2 cols): AI summary, folder structure, key insights
- Single column on mobile with logical stacking order

**Repository Overview Card**:
- Repository name (text-2xl font-bold)
- Owner/organization info
- Key metrics (stars, forks, language) in compact grid
- Last updated timestamp
- Direct GitHub link

**Technology Stack Display**:
- Badge-style pills for each detected technology
- Grouped by category: Frontend, Backend, DevOps, Testing
- Icon integration from Font Awesome for common frameworks

**Folder Structure Visualization**:
- Tree-style hierarchical display using indentation
- Folder icons (closed/open states)
- File type icons (js, py, md, etc.)
- Collapsible sections for deep directory trees
- Monospace font for file paths

**AI Summary Section**:
- Distinct card with subtle border
- "AI Analysis" header with sparkle/brain icon
- Multi-paragraph summary with clear sections:
  - Purpose & Overview
  - Key Technologies & Architecture
  - Main Features & Functionality
- Line height text-lg leading-relaxed for readability

**README Display** (when available):
- Tabbed interface: "AI Summary" | "Original README"
- Markdown rendering with proper styling
- Code blocks with syntax highlighting
- Scrollable container with max-height

**Loading States**:
- Skeleton loaders matching final content structure
- Progress indicator showing stages: "Fetching repository..." → "Analyzing structure..." → "Generating insights..."
- Animated pulse effect on placeholder content

**Empty/Error States**:
- Centered messaging with helpful icon
- Clear error explanation
- Actionable next steps (retry, check URL format)

### Navigation & Header
- Clean top navigation bar with RepoScope logo/name
- Minimal navigation: Home, About, GitHub link
- Subtle bottom border separator

### Animations
Use sparingly, only for:
- Input focus states (subtle glow)
- Loading spinners
- Smooth expansion of collapsible folder trees
- Fade-in for analysis results (once)

## Images
**Hero Section**: Include a clean, technical illustration showing:
- Abstract representation of repository analysis (branching diagrams, code symbols, AI brain)
- Placement: Full-width hero section (h-96) above input area
- Style: Modern, geometric, gradient-based illustration (NOT photograph)
- Purpose: Establish credibility and explain concept visually

## Key Design Principles
1. **Information First**: Every element serves data presentation
2. **Developer Familiarity**: Use patterns developers recognize from GitHub, IDEs
3. **Scannable Content**: Clear hierarchy allows quick information extraction
4. **Technical Precision**: Monospace fonts and proper formatting for code/paths
5. **Professional Restraint**: Clean, focused interface without visual noise