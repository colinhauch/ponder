# Ponder - MTG Deck Builder Assistant

## Project Overview

Ponder is an AI-assisted Magic: The Gathering deck builder built for players to build decks with AI assistance. It helps players build optimal decks from their card pools using AI suggestions and strategic insights.

**Target Users:** MTG players building decks, especially new players.
**Key Value:** AI-powered deck recommendations based on your specific card pool
**Current Phase:** Foundation/Early Development (Phase 1-2 of 4-phase roadmap)

## Tech Stack

### Frontend
- **Next.js 15** (latest) with App Router
- **React 19** (latest)
- **TypeScript 5**
- **Tailwind CSS** for styling
- **Mantine UI** (`@mantine/core`, `@mantine/form`, `@mantine/hooks`) - Primary component library
- **shadcn/ui** (Radix-based) - Secondary components
- **next-themes** for dark/light mode

### Backend & Database
- **Supabase** (latest)
  - PostgreSQL database with Row Level Security (RLS)
  - Authentication via `@supabase/ssr`
  - Real-time subscriptions for collaborative features
- **Supabase Project ID:** `iqyckdnagcmyvbuqbjxn`

### Deployment
- **Cloudflare Workers** via `@opennextjs/cloudflare`
- **Wrangler** for Cloudflare deployment
- NOT using Vercel (using Cloudflare instead)

### External APIs
- **Scryfall API** - MTG card data source (no API key required)
- **AI Providers** (planned) - Anthropic Claude, OpenAI

## Architecture Patterns

### App Router Structure
```
app/
├── decks/              # Public deck viewing (no auth required)
├── protected/          # Authenticated routes
│   ├── deck-editor/    # Main deck building interface
│   ├── decks/          # User's deck list
│   └── (other protected pages)
└── (auth pages)
```

### Supabase Integration
- **SSR-first:** Use `@supabase/ssr` for server components
- **Client access:** Create client in components only when needed
- **Middleware:** Route protection via `middleware.ts`
- **Environment:** `.env.local` for local dev, Wrangler secrets for production

### Database Schema Key Tables
- `cards` - MTG card data (imported from Scryfall)
- `decks` - User deck metadata
- `deck_cards` - Card membership in decks (junction table)
- `collections` - User card pools/collections
- `card_pools` - Collection metadata
- `chat_sessions` - AI conversation history

**RLS Policy:** All tables have Row Level Security enabled, scoped to `user_id`

## Development Workflow

### Essential Commands
```bash
# Development
npm run dev                    # Start Next.js dev server with Turbopack
npm run build                  # Build for production
npm run worker:build          # Build for Cloudflare Workers
npm run preview               # Preview Cloudflare build locally
# IMPORTANT: 
# do not use 'npm run deploy'. Cloudflare is configured to deploy upon commits being pushed.

# Database
npm run gen:db-types          # Generate TypeScript types from Supabase
npm run db:reset              # Reset local Supabase database
npm run db:push               # Push local migrations to remote
npm run db:pull               # Pull remote schema to local
npm run supabase:start        # Start local Supabase
npm run supabase:stop         # Stop local Supabase

# Scripts
npm run import-set            # Import MTG set data from Scryfall
npm run import-set-dry        # Dry run of set import
```

### Common Development Tasks
1. **After schema changes:** Run `npm run gen:db-types` to update TypeScript interfaces
2. **Before committing:** Ensure `npm run build` succeeds
3. **Testing imports:** Use `npm run import-set-dry` before full import
4. **Local Supabase:** Keep running with `npm run supabase:start` during dev

## Code Conventions

### Styling
- **Tailwind-first** for utility classes
- **Mantine components** for complex UI (forms, modals, layouts)
- **shadcn/ui** for buttons, dropdowns, basic components
- **2-space indentation** (verified in existing codebase)
- **Component organization:** `components/[feature]/[component-name].tsx`

### TypeScript
- **Strict mode enabled**
- **Database types:** Auto-generated in `lib/types/database.ts` - DO NOT edit manually
- **Custom types:** Define in `app/types.ts` or feature-specific type files
- **Prefer interfaces over types** for object shapes

### File Organization
```
app/                    # Next.js App Router pages
components/             # Reusable React components
  └── [feature]/       # Grouped by feature (decks, auth, etc.)
lib/                   # Utilities and services
  ├── supabase/        # Supabase client creation
  ├── types/           # TypeScript type definitions
  └── services/        # External API integrations (Scryfall, etc.)
scripts/               # Node scripts (data import, etc.)
supabase/              # Supabase config and migrations
public/                # Static assets
```

### Naming Conventions
- **Components:** PascalCase (`DeckCard.tsx`)
- **Utilities:** camelCase (`formatManaSymbols.ts`)
- **Database tables:** snake_case (`deck_cards`, `card_pools`)
- **Routes:** kebab-case (`/deck-builder`, `/deck-editor`)

## MTG Domain Knowledge

### Card Data Structure
- **Mana Cost:** String format (e.g., "{2}{U}{U}")
- **Colors:** Array of color identifiers (W, U, B, R, G)
- **CMC:** Converted Mana Cost (numeric)
- **Type Line:** Full type (e.g., "Creature — Human Wizard")
- **Oracle Text:** Official rules text

### Formats
- **Limited:** Draft and Sealed (primary focus)
- **Format Validation:** Minimum 40 cards main deck, no maximum sideboard
- **Pool Constraints:** Players build from their specific card pool only

### Deck Building Concepts
- **Mana Curve:** Distribution of cards by CMC
- **Color Identity:** Colors required to play the deck
- **Archetype:** Strategy type (Aggro, Control, Midrange, etc.)
- **Synergy:** Cards that work well together

## AI Integration (Planned)

### MCP Server Approach
- Custom MCP server for deck building tools
- Direct integration with card database
- Tools for: card search, deck analysis, format validation, suggestions

### Multi-Provider Support
- Anthropic Claude (primary)
- OpenAI (secondary)
- Model selection in user preferences
- Token usage tracking and budget controls

## Current Focus Areas

### Completed ✓
- Supabase project setup with auth
- Database schema design (cards, decks, collections)
- Scryfall API integration and card imports
- Basic authentication flow
- Protected routes with middleware

### In Progress 🔨
- Deck listing and display interface
- Card image optimization and display
- Deck editor UI components

### Next Up 📋
- Three-pane layout (deck builder / card pool / AI chat)
- Card filtering and search
- Manual deck building operations
- Collection/pool management

## Important Context

### Why Cloudflare Workers?
- Cost optimization for hobby project
- Better global performance for static assets
- Supabase edge functions handle backend logic
- Cloudflare handles Next.js SSR

### Authentication Design
- Email/password implemented (Supabase Auth)
- OAuth providers planned (Google, GitHub, Discord)
- Session managed via cookies (`@supabase/ssr`)
- All protected routes enforce auth in middleware

### Data Import Strategy
- Import full sets from Scryfall on-demand
- Cache card images via Cloudflare CDN
- User collections reference existing card data (foreign keys)
- No duplicate card storage per user

### Performance Considerations
- Lazy load card images in grid views
- Virtual scrolling for 1000+ card collections
- Debounced search inputs
- Database indexes on frequently queried columns (card name, colors, type)

## Gotchas & Non-Obvious Decisions

### Supabase SSR
- MUST create separate clients for server vs client components
- Cookie-based auth requires middleware configuration
- RLS policies checked on every query (test thoroughly)

### Mantine + shadcn/ui Hybrid
- Both libraries coexist (Mantine for complex, shadcn for simple)
- Watch for CSS conflicts (Mantine uses CSS-in-JS, Tailwind uses utility classes)
- Use Mantine theming for global styles

### Cloudflare Deployment
- Environment variables via `.dev.vars` (local) and Wrangler secrets (production)
- Some Next.js features unsupported (check `@opennextjs/cloudflare` docs)
- Build artifacts in `.open-next/` (gitignored)

### Database Type Generation
- Types in `lib/types/database.ts` are auto-generated
- Run `npm run gen:db-types` after every schema change
- Never manually edit database types file
- Requires Supabase CLI authentication

## Security Notes

- **RLS policies:** Enforced at database level for all tables
- **Auth tokens:** Stored in HTTP-only cookies
- **API routes:** Validate user session before operations
- **SQL injection:** Use Supabase parameterized queries (built-in protection)
- **XSS prevention:** React escapes by default, sanitize user input in forms

## Testing Strategy (Planned)

- **E2E:** Playwright for critical user flows
- **Unit:** Jest for utilities and services
- **Integration:** React Testing Library for components
- **Database:** Separate test Supabase project with reset capability

---

**Last Updated:** 2025-11-15
**Maintained By:** Colin Hauch
**Project Phase:** 1-2 of 4 (Foundation → Core Deck Building)
