# 01 Project Overview

## Project Overview

The MTG Deck Builder Assistant is a web-based application that leverages artificial intelligence to help Magic: The Gathering players construct optimal decks from defined card pools. The system combines traditional deck-building interfaces with conversational AI assistance, enabling users to receive intelligent suggestions, understand card synergies, and build competitive decks for various MTG formats.

The application addresses a fundamental challenge in Magic: The Gathering where players must construct coherent decks from potentially thousands of cards while considering complex interactions, mana curves, and format restrictions. By integrating AI assistance with traditional deck-building tools, the platform democratizes high-level deck construction knowledge and helps players of all skill levels create more effective decks.

## Architecture Philosophy

The system follows a modular, AI-first architecture where the artificial intelligence layer serves as the primary innovation driver while traditional deck-building interfaces provide familiar interaction patterns. The architecture prioritizes flexibility in AI model selection, cost-effective token usage, and seamless integration between conversational and visual deck-building paradigms.

Development follows a specification-first approach with clear separation between the AI integration layer, user interface components, and data management systems. This separation enables parallel development across team members while maintaining architectural coherence. The system is designed to start with limited format support (draft and sealed) while maintaining extensibility for future format additions.

## Technology Stack

### Core Framework

The application is built on Next.js 15 with TypeScript, providing a unified full-stack development experience with excellent developer ergonomics. The choice of Next.js over separate backend services simplifies deployment, reduces architectural complexity, and provides built-in optimizations for performance. TypeScript ensures type safety across the entire stack, from database schemas through API routes to React components.

React 18 powers the frontend with Material-UI providing consistent design patterns and pre-built components that accelerate development. The component architecture emphasizes reusability and composability, enabling rapid iteration on user interface designs while maintaining consistency.

### Backend Infrastructure

Supabase serves as the primary backend platform, providing PostgreSQL database, authentication, real-time subscriptions, and storage capabilities. The managed nature of Supabase reduces operational overhead while providing enterprise-grade reliability. The PostgreSQL foundation ensures ACID compliance for critical operations like collection management and deck modifications.

Vercel hosts the application, providing seamless integration with Next.js, automatic deployments, and edge function capabilities. The Vercel-Supabase combination offers predictable scaling patterns and simplified DevOps requirements, allowing the team to focus on feature development rather than infrastructure management.

### AI Integration Layer

The AI system is built around Model Context Protocol (MCP) support, enabling standardized communication with various AI providers. This protocol-first approach ensures model portability and prevents vendor lock-in. The custom MCP server exposes specialized tools for card search, deck analysis, and strategic recommendations.

The architecture supports multiple AI providers through a unified abstraction layer, allowing dynamic model selection based on query complexity, cost considerations, or user preferences. Initial support focuses on MCP-compatible models with established providers like Anthropic and OpenAI, with potential expansion to local models through Ollama for cost-sensitive operations.

### Data Integration

Scryfall API serves as the authoritative source for Magic card data, with intelligent caching strategies to minimize API calls and ensure data freshness. The existing MCP tool for Scryfall integration provides a working prototype, though a custom implementation will be developed to better serve application-specific needs.

Card data synchronization occurs through scheduled jobs that update the local database with new card releases and errata. This local cache enables fast queries, offline capability for cached data, and reduced external API dependencies during normal operation.

## Application Architecture

### Three-Pane Interface Design

The primary interface follows a three-pane layout optimized for simultaneous deck construction and AI interaction. The left pane contains the deck builder split horizontally between the current deck list (top) and AI-suggested cards (bottom). The center pane displays the available card pool with robust filtering and search capabilities. The right pane hosts the conversational AI interface for natural language deck-building assistance.

This layout maximizes information density while maintaining clear functional separation. Each pane operates semi-independently with coordinated updates through a central state management system. The design supports responsive scaling for different screen sizes while preserving the core three-pane structure on desktop displays.

### Data Model

The database schema centers on relationships between users, cards, collections, and decks. The cards table maintains a comprehensive cache of Magic card data including oracle text, mana costs, type lines, and format legalities. User collections track card ownership with quantity information, supporting inventory management requirements.

Card pools represent subsets of available cards, from complete collections to limited pools from draft events. The flexible pool system supports arbitrary card groupings, enabling features like wishlist pools or format-specific collections. Decks associate with specific card pools, enforcing that deck contents come from available cards while supporting theoretical deck building against the complete card database.

Chat sessions persist conversation history with associated deck and pool contexts, enabling continuation of deck-building discussions across sessions. AI response caching occurs at multiple levels, from individual card suggestions to complete deck analyses, reducing token usage for common queries.

### State Management

Application state follows a hierarchical model with global state for user authentication and preferences, feature-level state for deck building and collection management, and component-level state for UI interactions. The architecture supports both client-side state for responsive interactions and server-synchronized state for data persistence.

Real-time updates leverage Supabase subscriptions for collaborative features like shared card pools or team draft environments. Optimistic updates ensure responsive user experiences while maintaining eventual consistency with server state.

## Feature Domains

### Deck Construction Domain

The deck builder provides drag-and-drop card management between pools, decks, and sideboards. Real-time validation ensures format legality and deck constraints. The system tracks card quantities, mana curves, and color distributions with visual feedback for deck composition.

For limited formats, the system understands that unused pool cards constitute the sideboard, automatically managing this relationship. The interface supports quick card additions through double-click or keyboard shortcuts while maintaining the flexibility of drag-and-drop for precise placement.

### AI Assistance Domain

The conversational interface enables natural language deck building through commands like "add good removal for this deck" or "help me fix my mana base." The AI understands context from the current deck, available pool, and format restrictions to provide relevant suggestions.

Beyond simple card suggestions, the AI provides strategic insights about deck archetypes, sideboarding strategies, and meta considerations. The system can explain its reasoning, helping users understand why certain cards work well together or why specific suggestions improve the deck.

### Collection Management Domain

Users import collections through CSV uploads following standard formats from popular collection trackers. Manual entry supports quick additions of individual cards or small sets. The inventory tracking system maintains quantities for each card, preventing over-allocation to decks.

Multiple card pools enable organized collection management, from format-specific pools to draft pools from recent events. Pool sharing capabilities support team scenarios where players collaborate on deck building from shared card collections.

### Configuration Domain

User preferences control AI model selection, interface layouts, and default settings. The settings page exposes cost-tracking information, showing token usage and associated costs for AI interactions. Model selection allows users to choose between different AI providers based on their needs and budget.

System configuration includes cache management settings, data refresh intervals, and API rate limiting controls. Advanced users can access detailed logs of AI interactions for debugging or optimization purposes.

## Development Approach

### Repository Structure

The monorepo architecture uses npm workspaces to manage the Next.js application and custom MCP server as separate packages. The web application lives in the root directory following standard Next.js conventions. The MCP server resides in packages/mcp-server with its own dependencies and build process.

Components follow a feature-based organization with directories for deck-builder, card-pool, chat-interface, and shared components. Each feature directory contains components, hooks, utilities, and tests specific to that feature. Services directory houses AI integration, database queries, and external API communications.

### Testing Strategy

Playwright provides end-to-end testing for critical user journeys including deck creation, card pool management, and AI interactions. Tests verify both happy paths and edge cases, ensuring robust handling of user inputs and system states.

Unit tests using Jest and React Testing Library cover component logic, data transformations, and utility functions. API route testing ensures proper request handling, authentication, and error responses. The MCP server includes separate test suites for tool implementations and protocol compliance.

### Collaboration Framework

TypeScript interfaces define clear contracts between system components, enabling parallel development without integration conflicts. API documentation generated from TypeScript types provides always-current references for endpoint signatures and data structures.

Git workflow follows feature branch development with pull request reviews before merging. Conventional commits enable automated changelog generation and semantic versioning. GitHub Actions automate testing, linting, and deployment processes.

## Implementation Phases

### Phase 1: Foundation (Weeks 1-2)

Establish core infrastructure with Next.js setup, Supabase integration, and basic authentication. Implement database schema for cards, collections, and decks. Create simple card import from Scryfall for recent limited sets. Build basic three-pane layout without drag-and-drop functionality.

This phase delivers a functional but minimal deck builder where users can manually construct decks from imported cards. The focus remains on establishing solid architectural patterns and data models that support future enhancements.

### Phase 2: Core Deck Building (Weeks 3-4)

Implement complete deck builder functionality with search, filtering, and manual card addition. Add CSV import for collection management with quantity tracking. Create card pool system supporting multiple pools per user. Introduce basic deck validation for format legality and size requirements.

Phase 2 delivers the minimum viable product for deck construction without AI assistance. Users can manage collections, create card pools, and build legal limited decks through traditional interface patterns.

### Phase 3: AI Integration (Weeks 5-6)

Integrate MCP protocol support with initial AI provider connections. Implement chat interface with message history and context management. Create basic card suggestion system based on deck composition and available pools. Add model selection with at least two provider options.

This phase achieves the MVP goal of AI-assisted deck building for limited formats. The AI provides meaningful suggestions while respecting pool constraints and format requirements.

### Phase 4: Enhanced Experience (Weeks 7-8)

Add drag-and-drop functionality across all panes with smooth animations. Implement comprehensive caching strategies for AI responses and card data. Create real-time updates for collaborative pool management. Enhance AI capabilities with strategic insights and archetype detection.

Phase 4 polishes the user experience and optimizes system performance. Advanced features like deck sharing and sophisticated AI analysis prepare the system for public release.

## Cost Management Strategy

Token usage optimization begins with intelligent prompt engineering where only essential information reaches the AI. Card contexts include only relevant cards from current pools rather than entire databases. Structured data formats minimize token overhead while maintaining semantic clarity.

Response caching operates at multiple levels from individual card queries to complete deck analyses. Cache keys incorporate query parameters, pool contexts, and format restrictions to ensure cache validity. Time-based and event-based cache invalidation strategies balance freshness with cost efficiency.

The credit system allocates daily AI interaction budgets to users, preventing abuse while maintaining accessibility. Premium tiers offer increased quotas for power users. Model routing directs simple queries to cheaper models while reserving sophisticated models for complex strategic discussions.

## Technical Considerations

### Performance Optimization

Next.js provides automatic code splitting and lazy loading for optimal initial page loads. Image optimization through Next.js Image component with CDN caching reduces bandwidth usage. Virtual scrolling in card lists ensures smooth performance even with thousands of cards.

Database query optimization uses appropriate indexes on frequently searched fields like card names, types, and colors. Pagination and cursor-based navigation prevent large result set transfers. Debounced search inputs reduce unnecessary API calls during user typing.

### Security Framework

Supabase Row Level Security policies ensure users only access their own data. API routes validate user permissions before processing requests. Input sanitization prevents injection attacks in search queries and user-generated content.

Rate limiting on AI endpoints prevents abuse and controls costs. Session management includes appropriate timeout and refresh strategies. Sensitive configuration data remains in environment variables, never exposed to client code.

### Scalability Planning

The architecture supports horizontal scaling through Vercel's edge network and Supabase's managed infrastructure. Database connection pooling prevents connection exhaustion under load. Caching strategies reduce database load for frequently accessed data.

The MCP server design allows independent scaling from the main application. Queue-based processing for expensive operations enables load distribution. Monitoring and alerting systems track performance metrics and cost trends.

## Future Considerations

### Format Expansion

While the MVP focuses on limited formats, the architecture supports expansion to constructed formats like Standard, Modern, and Commander. Format-specific rules engines and card pools enable gradual feature rollout. The AI system can be trained on format-specific strategies and meta considerations.

### Advanced Analytics

Future phases could introduce sophisticated deck analysis with win-rate predictions and meta-game tracking. Machine learning models could identify emerging deck archetypes and suggest innovations. Integration with tournament results could provide real-world performance data.

### Platform Extensions

Mobile applications could provide on-the-go deck building and collection management. Browser extensions could integrate with online Magic platforms for seamless deck import/export. API exposure could enable third-party integrations and ecosystem development.

## References

Related specifications will include detailed documentation for the MCP server implementation (02_mcp_server.md), AI integration patterns (03_ai_integration.md), and deck builder interface (04_deck_builder_ui.md). These specifications will build upon the architectural foundation established in this overview document.