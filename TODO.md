# MTG Deck Builder Assistant - Project TODO

## Project Overview
This TODO list is organized by the implementation phases outlined in the project specification. Each phase builds upon the previous one, creating a complete AI-assisted deck building application.

---

## Phase 1: Foundation (Weeks 1-2)
**Goal:** Establish core infrastructure and basic architecture

### Database & Backend Setup
- [x] **Set up Supabase project**
  - [x] Create new Supabase project
  - [x] Configure environment variables in `.env.local`
  - [x] Set up database connection in `/lib/supabase/`

- [ ] **Design and implement database schema**
  - [x] Create `cards` table (id, name, mana_cost, type_line, oracle_text, colors, cmc, etc.)
  - [x] Create `collections` table (user_id, card_id, quantity, pool_name)
  - [ ] Create `decks` table (id, user_id, name, format, pool_id, created_at)
  - [ ] Create `deck_cards` table (deck_id, card_id, quantity, sideboard)
  - [ ] Create `card_pools` table (id, user_id, name, description, format)
  - [ ] Create `chat_sessions` table (id, user_id, deck_id, messages, created_at)
  - [ ] Set up Row Level Security (RLS) policies
  - [ ] Create database indexes for performance

### Authentication Setup
- [ ] **Implement user authentication with Supabase Auth**
  - [ ] Configure auth providers (email/password minimum)
  - [ ] Update auth components in `/components/`
  - [ ] Test authentication flow
  - [ ] Set up protected routes middleware

### Basic Card Data Import
- [ ] **Scryfall API integration**
  - [ ] Create Scryfall service in `/lib/services/scryfall.ts`
  - [ ] Implement card search and retrieval functions
  - [ ] Create data transformation utilities
  - [ ] Import cards from recent limited sets (start with 1-2 sets)
  - [ ] Set up caching strategy for card data

### Three-Pane Layout Foundation
- [ ] **Create basic layout structure**
  - [ ] Design responsive three-pane layout component
  - [ ] Implement left pane (deck builder placeholder)
  - [ ] Implement center pane (card pool placeholder)
  - [ ] Implement right pane (chat interface placeholder)
  - [ ] Add basic responsive behavior

---

## Phase 2: Core Deck Building (Weeks 3-4)
**Goal:** Complete deck builder functionality without AI

### Deck Builder Interface
- [ ] **Left pane: Deck management**
  - [ ] Create deck list component with card quantities
  - [ ] Implement deck statistics (mana curve, color distribution)
  - [ ] Add deck validation (format legality, size requirements)
  - [ ] Create new deck/save deck functionality
  - [ ] Implement basic deck operations (clear, duplicate)

### Card Pool Management
- [ ] **Center pane: Card browsing**
  - [ ] Create card grid/list view with images
  - [ ] Implement search functionality (name, type, cost, etc.)
  - [ ] Add filtering system (colors, types, rarity, etc.)
  - [ ] Create sorting options (name, cost, color, type)
  - [ ] Add pagination for large card sets
  - [ ] Implement card detail modal/hover

### Collection Management
- [ ] **Collection import and management**
  - [ ] Create CSV import functionality
  - [ ] Support common collection formats (MTGGoldfish, Deckbox, etc.)
  - [ ] Implement manual card addition interface
  - [ ] Create collection inventory tracking (quantities)
  - [ ] Add multiple card pool support per user
  - [ ] Implement pool sharing capabilities

### Deck Building Operations
- [ ] **Manual deck construction**
  - [ ] Add cards to deck (click/double-click)
  - [ ] Remove cards from deck
  - [ ] Adjust card quantities
  - [ ] Move cards between main deck and sideboard
  - [ ] Implement deck export (various formats)
  - [ ] Create deck statistics visualization

---

## Phase 3: AI Integration (Weeks 5-6)
**Goal:** Implement AI-assisted deck building

### MCP Server Development
- [ ] **Create custom MCP server**
  - [ ] Set up MCP server in `/packages/mcp-server/`
  - [ ] Implement card search tools
  - [ ] Create deck analysis tools
  - [ ] Add format validation tools
  - [ ] Implement card suggestion algorithms
  - [ ] Create strategic insight tools

### AI Provider Integration
- [ ] **Multi-provider AI support**
  - [ ] Create AI abstraction layer in `/lib/ai/`
  - [ ] Implement Anthropic (Claude) integration
  - [ ] Implement OpenAI integration
  - [ ] Add model selection functionality
  - [ ] Create prompt engineering utilities
  - [ ] Implement token usage tracking

### Chat Interface
- [ ] **Right pane: AI conversation**
  - [ ] Create chat message components
  - [ ] Implement message history persistence
  - [ ] Add typing indicators and loading states
  - [ ] Create context management (current deck, pool)
  - [ ] Implement suggested commands/prompts
  - [ ] Add conversation export functionality

### AI-Powered Features
- [ ] **Core AI deck building assistance**
  - [ ] Implement card suggestion based on deck composition
  - [ ] Create mana base recommendations
  - [ ] Add deck archetype detection
  - [ ] Implement removal/interaction suggestions
  - [ ] Create curve optimization suggestions
  - [ ] Add sideboard recommendations

---

## Phase 4: Enhanced Experience (Weeks 7-8)
**Goal:** Polish UX and optimize performance

### Advanced UI Features
- [ ] **Drag and drop functionality**
  - [ ] Implement drag-and-drop between panes
  - [ ] Add smooth animations and transitions
  - [ ] Create visual feedback for drop zones
  - [ ] Support multi-card selection and operations
  - [ ] Add keyboard shortcuts for power users

### Performance Optimization
- [ ] **Caching and optimization**
  - [ ] Implement AI response caching
  - [ ] Add card image lazy loading
  - [ ] Create virtual scrolling for large lists
  - [ ] Optimize database queries with proper indexing
  - [ ] Add client-side caching strategies
  - [ ] Implement debounced search inputs

### Real-time Features
- [ ] **Collaborative functionality**
  - [ ] Implement real-time deck updates
  - [ ] Add collaborative pool management
  - [ ] Create deck sharing functionality
  - [ ] Implement live collaboration indicators
  - [ ] Add conflict resolution for simultaneous edits

### Enhanced AI Capabilities
- [ ] **Advanced AI features**
  - [ ] Implement strategic archetype analysis
  - [ ] Add meta-game awareness
  - [ ] Create draft/sealed specific insights
  - [ ] Implement card synergy detection
  - [ ] Add deck weakness identification
  - [ ] Create detailed deck reports

---

## Configuration & Settings
**Ongoing throughout all phases**

### User Preferences
- [ ] **Settings interface**
  - [ ] Create user preferences page
  - [ ] Implement AI model selection
  - [ ] Add interface layout customization
  - [ ] Create cost tracking and budget controls
  - [ ] Add dark/light theme support
  - [ ] Implement export/import of user settings

### System Configuration
- [ ] **Admin and maintenance**
  - [ ] Create system health monitoring
  - [ ] Implement API rate limiting
  - [ ] Add comprehensive error logging
  - [ ] Create data backup strategies
  - [ ] Implement cache management tools
  - [ ] Add performance monitoring

---

## Testing & Quality Assurance
**Continuous throughout development**

### Testing Infrastructure
- [ ] **Set up testing frameworks**
  - [ ] Configure Playwright for E2E testing
  - [ ] Set up Jest for unit testing
  - [ ] Configure React Testing Library
  - [ ] Create test database setup
  - [ ] Add continuous integration pipeline

### Test Coverage
- [ ] **Core functionality tests**
  - [ ] Authentication flow tests
  - [ ] Deck building operation tests
  - [ ] AI interaction tests
  - [ ] Collection management tests
  - [ ] Database operation tests
  - [ ] API endpoint tests

### Performance Testing
- [ ] **Load and performance tests**
  - [ ] Test with large card collections
  - [ ] Verify AI response times
  - [ ] Test real-time collaboration limits
  - [ ] Validate database performance under load
  - [ ] Test mobile responsiveness

---

## Deployment & DevOps

### Production Setup
- [ ] **Deployment pipeline**
  - [ ] Configure Vercel deployment
  - [ ] Set up production environment variables
  - [ ] Create production Supabase instance
  - [ ] Configure domain and SSL
  - [ ] Set up monitoring and alerting

### Security & Compliance
- [ ] **Security measures**
  - [ ] Audit authentication implementation
  - [ ] Review database security policies
  - [ ] Implement rate limiting
  - [ ] Add input sanitization
  - [ ] Create security testing checklist

---

## Documentation
**Final phase deliverables**

### Technical Documentation
- [ ] **Developer documentation**
  - [ ] API documentation
  - [ ] Database schema documentation
  - [ ] MCP server documentation
  - [ ] Deployment guide
  - [ ] Architecture decision records

### User Documentation
- [ ] **User guides**
  - [ ] User onboarding guide
  - [ ] Deck building tutorial
  - [ ] AI assistance guide
  - [ ] Collection management guide
  - [ ] FAQ and troubleshooting

---

## Notes
- Each checkbox represents a discrete, testable deliverable
- Phases can overlap, but dependencies should be respected
- Regular testing and validation should occur throughout each phase
- Consider creating separate feature branches for major components
- Maintain updated documentation as features are implemented

## Success Metrics
- [ ] Users can successfully import collections and build legal decks
- [ ] AI provides relevant and helpful deck building suggestions
- [ ] Application performs well with 1000+ card collections
- [ ] Real-time collaboration works smoothly for 2-4 users
- [ ] Token usage stays within budget constraints
- [ ] Mobile interface is fully functional