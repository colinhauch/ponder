# Seeding Card Data

This document explains how to populate the `cards` table with MTG card data from Scryfall.

## Quick Start

To seed your local database with the TLA (Temporal Odyssey) set:

```bash
# 1. Ensure local Supabase is running
npm run supabase:start

# 2. Import the TLA set
npm run import-set tla
```

This will import all cards from the TLA set into your local database.

## Why Not Use seed.sql?

Card data is **not included in `seed.sql`** for several reasons:

1. **Size**: Each MTG set contains 200-400+ cards, making SQL files massive and hard to maintain
2. **Updates**: Card data changes (errata, reprints) and needs periodic updates from Scryfall
3. **Flexibility**: Different developers might want different sets for testing
4. **Source of Truth**: Scryfall API is the authoritative source; better to import directly

## Import Script

The import script is located at `scripts/import-set.ts` and handles:

- Fetching card data from Scryfall API
- Transforming data to match our schema
- Batch uploading to Supabase (1000 cards per batch)
- Upsert logic (updates existing cards if they already exist)

## Available Commands

```bash
# Import a specific set
npm run import-set <set-code>

# Dry run (shows what would be imported without actually importing)
npm run import-set-dry <set-code>
```

## Common Set Codes

| Set Code | Set Name | Cards |
|----------|----------|-------|
| `tla` | Temporal Odyssey | ~280 |
| `dsk` | Duskmourn: House of Horror | ~270 |
| `blb` | Bloomburrow | ~260 |
| `mh3` | Modern Horizons 3 | ~300 |
| `otj` | Outlaws of Thunder Junction | ~270 |
| `mkm` | Murders at Karlov Manor | ~280 |
| `lci` | The Lost Caverns of Ixalan | ~280 |

Find more set codes at: https://scryfall.com/sets

## Environment Requirements

The import script requires:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `SUPABASE_SERVICE_ROLE_KEY` - Auth credentials

These are automatically loaded from `.env.local` when you run the script.

## For Production

To seed the production database:

```bash
# 1. Temporarily update .env.local to point to production
# OR set environment variables directly:
NEXT_PUBLIC_SUPABASE_URL=https://iqyckdnagcmyvbuqbjxn.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key \
npm run import-set tla

# 2. Restore .env.local to local development settings
```

**Note**: Be careful when importing to production. The script uses upsert logic, so it's safe to run multiple times.

## Troubleshooting

**Error: "cards table does not exist"**
- Run `npm run db:reset` to apply all migrations

**Error: "Rate limit exceeded"**
- The script includes 100ms delays between requests to respect Scryfall's rate limits
- If you see this error, wait a minute and try again

**Import takes a long time**
- This is normal! Scryfall's API has rate limits
- A 280-card set takes ~30 seconds to import
- The script shows progress as it imports

## Card Data Schema

Imported cards include:

- Basic info: name, mana cost, CMC, type line
- Combat stats: power, toughness (for creatures)
- Colors: colors array, color identity
- Set info: set code, collector number, rarity
- Keywords: comma-separated keyword abilities
- Images: JSON object with multiple image URLs
- Scryfall ID: unique identifier for upsert operations
