# 02 Database Schema

## Overview

The MTG Deck Builder Assistant implements a hybrid data storage strategy that balances query performance with data freshness. Rather than choosing between complete local storage or pure API-based access, the system stores essential deck-building fields locally while maintaining direct access to comprehensive card information through Scryfall API integration. This approach optimizes for the primary use case where users need fast filtering and searching during deck construction, while ensuring they always have access to complete, up-to-date card details including oracle text, rulings, and current pricing.

The database schema follows Scryfall's type system exactly, enabling seamless data mapping without transformation overhead. This compatibility decision prevents data loss through type conversions and ensures local data structures remain valid as Scryfall evolves their API. The schema prioritizes deck-building performance while maintaining flexibility to access comprehensive card details on demand.

## Database Architecture Patterns

The database implements a clear separation between public card data and user-specific information. Magic card data represents public information that all users should access efficiently, while personal collections, decks, and AI conversations require strict user isolation through Row Level Security policies. This architectural decision enables shared indexes and caching for card data while maintaining complete privacy for user-generated content.

Database migrations follow Supabase's versioned migration system, creating reproducible deployments across development, staging, and production environments. The `npm run gen:db-types` command generates TypeScript interfaces directly from the live database schema, ensuring compile-time type safety and preventing schema drift. When schema changes occur, running this command updates the TypeScript definitions in `/lib/types/database.ts` to match the current database structure exactly.

The migration workflow uses `supabase migration new` to create timestamped SQL files in `/supabase/migrations/`, followed by `supabase db push` to apply changes to the remote database. This process creates a complete audit trail of schema evolution while enabling rollback capabilities for problematic changes.

## Cards Table Implementation

The cards table serves as the foundation for all deck-building operations by storing essential Magic card information locally while preserving access to complete Scryfall data. Local storage includes fields required for immediate deck construction queries such as mana costs for curve analysis, color identity for format legality checks, type lines for category filtering, and power/toughness values for creature evaluation. These fields enable complex queries like finding all red creatures with converted mana cost three or less to execute entirely against the local database without external API calls.

Each card record includes a direct Scryfall URI that provides immediate access to the complete card object including oracle text, comprehensive rulings, flavor text, and current market pricing. This URI field serves as a permanent link to Scryfall's REST API, ensuring that detailed card information always reflects the current state of the game including recent errata, functional changes, and updated tournament rulings.

The schema uses UUID primary keys that match Scryfall's identifier system exactly, enabling direct foreign key relationships throughout the application. PostgreSQL custom enums for colors, rarities, and other categorical fields match Scryfall's enumerated values precisely, ensuring perfect API compatibility while providing database-level validation.

## Collections Table Structure

The collections table implements user card ownership tracking with flexible organization through named pools. Each collection entry represents a specific quantity of a particular card owned by a user within a designated pool such as their main collection, a draft pool from a recent event, or a wishlist of desired cards. The table uses a composite unique constraint on user_id, card_id, and pool_name to ensure exactly one quantity entry per user-card-pool combination while allowing the same card to appear in multiple pools with different quantities.

The pool_name field enables sophisticated collection organization beyond simple ownership tracking. Users can maintain separate pools for different purposes such as "main-collection" for their permanent cards, "draft-2024-09-30" for cards from a specific draft event, "trade-binder" for cards available for trading, or "wishlist" for cards they want to acquire. This flexibility supports the varied ways Magic players organize their collections while maintaining simple query patterns for deck-building operations.

Row Level Security policies ensure users can only access their own collection data while maintaining query performance through proper indexing. The policies use Supabase's built-in authentication system to identify users and enforce access restrictions at the database level, preventing unauthorized access even if application-level security controls fail. Indexes on user_id, card_id, and the composite user_id-pool_name combination enable efficient queries for common collection management operations.

## Schema Migration Process

The recent addition of the collections table demonstrates the established workflow for database schema evolution. The process begins with `supabase migration new create_collections_table` which creates a timestamped SQL file in the migrations directory. The migration file contains complete table creation including all constraints, indexes, Row Level Security policies, and helpful comments that document the table's purpose and field meanings.

After writing the migration SQL, `supabase db push` applies the changes to the remote Supabase database while maintaining a complete audit trail of schema modifications. The system prompts for confirmation before applying migrations, allowing review of changes before they become permanent. Following successful migration application, `npm run gen:db-types` regenerates the TypeScript interface definitions to include the new table structure, ensuring that client code immediately benefits from compile-time type checking for the new schema elements.

This workflow supports collaborative development where multiple team members can modify the database schema through versioned migration files that integrate with standard git workflows. Each migration receives a timestamp ensuring they apply in the correct chronological order across different development environments.

## Data Integration Strategy

The hybrid storage approach addresses the fundamental tension between application performance and data completeness that affects all Magic-related applications. Complete local storage would provide the fastest possible queries but requires substantial storage overhead and complex synchronization logic for every card update or errata. Pure API access ensures perfect data freshness but creates unacceptable latency for deck-building operations where users frequently filter large card sets.

The chosen hybrid approach stores approximately twenty essential fields locally while preserving access to hundreds of additional fields through stored API endpoints. Local fields include all information required for deck construction workflows, mana curve analysis, format legality validation, and card categorization. The stored Scryfall URI provides instant access to comprehensive card details when users need complete information for specific cards during deck evaluation or strategic analysis.

This architecture enables the application to perform sophisticated local queries for deck-building operations while maintaining access to the complete Scryfall ecosystem for detailed card information, pricing data, and rules clarifications. The approach scales efficiently as new cards are released since only essential fields require local storage while complete information remains accessible through the established API integration patterns.

## Future Schema Development

The current implementation establishes architectural patterns that will guide development of the remaining database tables outlined in the project specification. The collections table demonstrates the approach for user-specific data with Row Level Security policies, proper indexing strategies, and integration with the type generation system. Future tables including decks, deck_cards, card_pools, and chat_sessions will follow these established patterns while extending the schema to support additional application features.

The versioned migration system provides a foundation for iterative schema development while maintaining system stability across development phases. As new features require additional database tables or modifications to existing structures, the established workflow of creating timestamped migrations, applying them through `supabase db push`, and regenerating TypeScript types ensures that schema evolution remains controlled and predictable.

The hybrid storage philosophy proven effective for card data may extend to other areas of the application where balancing local performance with external data sources becomes relevant. The collections table represents the first pure application data structure, establishing patterns for user data management that will scale as the application grows in complexity and user base.