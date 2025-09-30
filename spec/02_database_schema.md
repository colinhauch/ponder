# 02 Database Schema

## Overview

The MTG Deck Builder Assistant database schema implements a hybrid approach to Magic card data storage that balances performance, cost efficiency, and data freshness. The primary architectural decision centers on maintaining essential gameplay data locally while preserving access to complete, always-current card information through direct Scryfall API integration. This approach optimizes for the deck-building use case where fast filtering and searching are critical while ensuring users always have access to the most complete and up-to-date card information.

The schema follows Scryfall's type system exactly, enabling seamless data mapping between the API and local storage without transformation overhead. This compatibility decision prevents data loss through type conversions and ensures that local data structures remain valid as Scryfall evolves their API. The database design prioritizes deck-building performance while maintaining the flexibility to access comprehensive card details on demand.

## Cards Table Architecture

### Hybrid Storage Strategy

The cards table implements a strategic hybrid approach where essential deck-building fields are stored locally for immediate query performance, while complete card data remains accessible through stored Scryfall API endpoints. This design addresses the fundamental tension between application performance and data completeness that affects all Magic-related applications.

Local storage includes fields required for deck construction activities: mana costs for curve analysis, color identity for deck legality checks, type lines for category filtering, and power/toughness values for creature evaluation. These fields enable complex queries like "find all red creatures with converted mana cost 3 or less" to execute entirely against the local database without external API calls. The performance benefit becomes critical when users filter large card pools or perform real-time deck validation.

The API integration component stores the direct Scryfall URI for each card, providing immediate access to the complete card object including oracle text, rulings, flavor text, and current pricing information. This URI field serves as a direct link to Scryfall's REST API, ensuring that detailed card information reflects the current state of the game including errata, functional changes, and updated rulings.

### Scryfall Type Compatibility

The schema implements exact type compatibility with Scryfall's API specification to ensure seamless data integration. PostgreSQL custom enums match Scryfall's enumerated values for colors ('W', 'U', 'B', 'R', 'G'), rarities ('common', 'uncommon', 'rare', 'mythic', 'special', 'bonus'), and other categorical fields. This type safety prevents invalid data entry while maintaining perfect compatibility with API responses.

The choice to use decimal type for converted mana cost accommodates Scryfall's handling of fractional costs found in special sets and promotional cards. While most Magic cards use integer mana costs, maintaining decimal precision ensures the schema can handle all existing cards and future edge cases without requiring schema migrations.

UUID fields throughout the schema match Scryfall's identifier system exactly, enabling direct foreign key relationships and preventing identifier conflicts. The oracle_id field groups functionally identical cards across printings, while the main id field provides unique identification for specific card printings. This dual identifier system supports both deck building (which typically cares about card function) and collection management (which tracks specific printings).

### Performance Optimization Through Indexing

The indexing strategy focuses on deck-building query patterns while maintaining reasonable storage overhead. Primary indexes cover fields used in common filtering operations: card names for search, colors for deck restriction checks, converted mana cost for curve analysis, and type lines for category filters. These indexes enable sub-second query performance even when searching thousands of cards.

Composite indexes address multi-field queries common in deck building scenarios. The colors and converted mana cost composite index accelerates queries like "find all blue cards with CMC 2-4" that frequently occur during deck construction. The set code and collector number composite index supports collection management operations where users track specific card printings.

Full-text search indexes on oracle text and type lines enable sophisticated card searches using PostgreSQL's built-in text search capabilities. These indexes support queries like "find cards that mention 'enters the battlefield'" without requiring external search services. The GIN indexes on array fields (colors, keywords) provide efficient containment queries for multi-value searches.

## Data Integration Architecture

### Scryfall API Integration

The integration strategy treats Scryfall as the authoritative source for all Magic card data while maintaining local caches for performance-critical operations. The stored URI field in each card record provides a direct endpoint to Scryfall's API, eliminating the need to construct API calls or manage changing endpoint structures. This approach ensures that detailed card information remains current even if local cache data becomes stale.

Batch import operations populate the cards table with data from specific Magic sets, starting with recent limited formats that align with the application's initial focus. The import process transforms Scryfall's JSON responses into the local schema while preserving the URI field for future API access. This selective import approach manages database size while ensuring users have access to cards relevant to their deck-building activities.

The caching strategy operates on multiple time scales: frequently accessed cards receive longer cache durations while rarely viewed cards may cache for shorter periods. Cache invalidation occurs through combination of time-based expiration and event-based triggers when Scryfall announces card updates or errata. This multi-tier approach balances data freshness with API usage efficiency.

### Type Generation and Schema Synchronization

The database schema integrates with Supabase's type generation system to provide compile-time type safety across the entire application stack. The `npm run gen:db-types` command generates TypeScript interfaces that exactly match the database schema, ensuring that client code cannot introduce type mismatches or access undefined fields.

This generated type system enables sophisticated IDE support with autocomplete, error detection, and refactoring capabilities throughout the codebase. Changes to the database schema automatically propagate to TypeScript interfaces, making schema evolution safer and more predictable. The type generation process also validates that database enums match TypeScript union types, preventing runtime errors from invalid enumeration values.

Schema migrations use Supabase's migration system to version control database changes and enable reproducible deployments. Each schema modification creates a versioned migration file that can be applied to development, staging, and production environments consistently. This approach supports collaborative development where multiple developers may modify the schema simultaneously.

## Alternative Approaches Considered

### Full Local Storage

A complete local storage approach would cache all Scryfall data in the local database, including oracle text, rulings, and flavor text for every card. This approach would provide the fastest possible query performance and complete offline functionality. However, the storage requirements would be substantial, potentially requiring hundreds of gigabytes for the complete Magic card database including all printings and languages.

The cost implications of full local storage extend beyond simple storage fees to include synchronization complexity and maintenance overhead. Every card update, errata, or rules change would require database updates, creating ongoing operational burden. The synchronization system would need to handle partial updates, conflict resolution, and rollback scenarios. Given the application's focus on deck building rather than comprehensive card reference, these costs outweigh the performance benefits.

### API-Only Approach

An API-only approach would store minimal card identifiers locally while fetching all card details from Scryfall on demand. This approach would ensure perfect data freshness and minimal local storage requirements. Users would always see the most current card information including recent updates and corrections.

The performance characteristics of API-only access make this approach unsuitable for deck building workflows. Card filtering operations would require fetching potentially hundreds of cards from the API to apply local filters, creating unacceptable latency and API usage costs. Scryfall's rate limiting would prevent responsive user interactions during deck construction. Network connectivity requirements would make the application unusable in offline scenarios common at tournaments and gaming events.

### Cached API Responses

A cached API response approach would store complete Scryfall JSON responses locally with time-based expiration. This approach would provide good performance for repeated access while maintaining data freshness through cache invalidation. The implementation complexity would be lower than custom schema design since it avoids data transformation.

However, cached JSON responses would prevent efficient database queries for deck building operations. Filtering cards by color or mana cost would require deserializing and processing JSON documents rather than using database indexes. The storage overhead would be significant due to JSON formatting and repeated field names. Query optimization would be limited compared to properly normalized relational data.

## Security and Access Control

### Row Level Security Implementation

The database implements Row Level Security (RLS) policies to ensure users can only access their own data while maintaining performance for authorized operations. Card data uses global read access since Magic cards represent public information that all users should access. User-specific tables like collections, decks, and chat sessions implement strict user-based access controls.

The RLS policies use Supabase's authentication system to identify users and enforce access restrictions at the database level. This approach prevents unauthorized access even if application-level security controls fail. The policies are designed to work efficiently with the indexing strategy, ensuring that security enforcement does not create performance penalties for normal operations.

### API Key Management

Scryfall API integration uses application-level API keys rather than user-specific authentication. This approach enables efficient caching and rate limiting while protecting user privacy. The application manages API usage across all users to stay within Scryfall's rate limits while providing responsive performance.

Future considerations include user-specific API keys for premium features or higher rate limits. The architecture supports this extension through configuration parameters without requiring schema changes. API key rotation and management follow security best practices with environment variable storage and automatic key refresh capabilities.

## Future Schema Considerations

### Format-Specific Extensions

The current schema focuses on limited formats but includes architectural provisions for constructed format support. Future extensions might include format-specific legality tracking, ban list management, and meta-game statistics. The flexible legalities JSONB field can accommodate these extensions without requiring schema migrations.

Constructed formats introduce additional complexity around deck archetype classification, card role identification, and performance tracking. The schema design anticipates these requirements through extensible JSON fields and reserved table names for future format-specific features.

### Performance Scaling

As the user base grows, the schema may require additional optimization for large-scale operations. Partitioning strategies could separate card data by set or format to improve query performance. Read replicas could handle search-heavy operations while preserving write performance on the primary database.

Materialized views might cache complex deck statistics or popular card combinations to reduce computation overhead. The current indexing strategy provides a foundation for these optimizations while maintaining compatibility with existing application code.

### Integration Extensions

Future integrations with other Magic platforms or tournament systems might require additional identifier fields or synchronization tables. The schema design accommodates these extensions through reserved field names and flexible foreign key relationships. OAuth integration tables could enable data sharing with external platforms while maintaining user control over data access.

## Implementation Status

The database schema specification represents the current architectural decisions and implementation plans for the cards table. Additional tables for collections, decks, card pools, and chat sessions will extend this specification as development progresses. The type generation system and migration framework provide the foundation for iterative schema development while maintaining system stability.

This specification will be updated as additional database components are implemented, ensuring that architectural decisions and implementation details remain documented and accessible to development team members. The hybrid approach documented here establishes patterns that will guide future database design decisions throughout the project lifecycle.