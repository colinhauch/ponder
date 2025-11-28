#!/usr/bin/env tsx

import * as dotenv from 'dotenv';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { ScryfallClient } from './scryfallClient';
import { SupabaseCardImporter } from './supabaseClient';
import { mapCardsToSupabase } from './cardMapper';
import { SupabaseCard } from './types';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

interface ImportConfig {
  setCode: string;
  includeTokens?: boolean;
  includeVariations?: boolean;
  batchSize?: number;
  refreshSet?: boolean;
  tableName?: string;
  saveSample?: boolean;
  saveComplete?: boolean;
  outputDir?: string;
}

/**
 * Save sample cards to a local JSON file for inspection
 */
async function saveCardsToFile(
  cards: SupabaseCard[],
  setCode: string,
  outputDir: string = './data'
): Promise<string> {
  const fileName = `${setCode}-cards-sample-${new Date().toISOString().split('T')[0]}.json`;
  const filePath = join(outputDir, fileName);

  const dataToSave = {
    metadata: {
      setCode,
      cardCount: cards.length,
      exportedAt: new Date().toISOString(),
    },
    cards: cards.slice(0, 5), // Save first 5 cards as sample
    sample: true,
    fullDataMessage: `This file contains a sample of 5 cards. Full dataset has ${cards.length} cards.`
  };

  await writeFile(filePath, JSON.stringify(dataToSave, null, 2), 'utf-8');
  console.log(`📁 Sample data saved to: ${filePath}`);
  return filePath;
}

/**
 * Save complete dataset to file
 */
async function saveCompleteCardsToFile(
  cards: SupabaseCard[],
  setCode: string,
  outputDir: string = './data'
): Promise<string> {
  const fileName = `${setCode}-cards-complete-${new Date().toISOString().split('T')[0]}.json`;
  const filePath = join(outputDir, fileName);

  const dataToSave = {
    metadata: {
      setCode,
      cardCount: cards.length,
      exportedAt: new Date().toISOString(),
    },
    cards: cards
  };

  await writeFile(filePath, JSON.stringify(dataToSave, null, 2), 'utf-8');
  console.log(`📁 Complete data saved to: ${filePath}`);
  console.log(`⚠️  File size: ${(JSON.stringify(dataToSave).length / 1024 / 1024).toFixed(2)} MB`);
  return filePath;
}

/**
 * Main import function
 */
async function importSetToSupabase(config: ImportConfig): Promise<void> {
  const {
    setCode,
    includeTokens = false,
    includeVariations = false,
    batchSize = 100,
    refreshSet = false,
    tableName = 'cards',
    saveSample = false,
    saveComplete = false,
    outputDir = './data',
  } = config;

  // Validate environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Missing Supabase environment variables. Please check your .env.local file contains:\n' +
      '- NEXT_PUBLIC_SUPABASE_URL\n' +
      '- SUPABASE_SERVICE_ROLE_KEY (recommended) or NEXT_PUBLIC_SUPABASE_ANON_KEY'
    );
  }

  // Log which key type is being used
  const keyType = process.env.SUPABASE_SERVICE_ROLE_KEY ? 'service role' : 'anon';
  console.log(`🔑 Using ${keyType} key for database operations`);

  console.log('='.repeat(60));
  console.log(`Starting import for set: ${setCode.toUpperCase()}`);
  console.log('='.repeat(60));

  // Initialize clients
  const scryfallClient = new ScryfallClient();
  const supabaseImporter = new SupabaseCardImporter(supabaseUrl, supabaseKey, tableName);

  try {
    // Step 1: Optionally delete existing cards from this set
    if (refreshSet) {
      console.log('\n[1/4] Deleting existing cards from set...');
      await supabaseImporter.deleteCardsBySet(setCode);
    } else {
      console.log('\n[1/4] Checking existing cards...');
      const existingCount = await supabaseImporter.getSetCardCount(setCode);
      console.log(`Found ${existingCount} existing cards from this set`);
    }

    // Step 2: Fetch cards from Scryfall
    console.log('\n[2/4] Fetching cards from Scryfall...');
    const scryfallCards = await scryfallClient.getCardsBySet(setCode, {
      includeTokens,
      includeVariations,
    });

    if (scryfallCards.length === 0) {
      console.log('No cards found for this set. Check the set code and try again.');
      return;
    }

    // Step 3: Transform cards to Supabase format
    console.log('\n[3/4] Transforming card data...');
    const supabaseCards = mapCardsToSupabase(scryfallCards);
    console.log(`Transformed ${supabaseCards.length} cards`);

    // Step 4: Upload to Supabase
    console.log('\n[4/4] Uploading to Supabase...');
    await supabaseImporter.uploadCards(supabaseCards, batchSize);

    // Optional: Save to file
    if (saveSample || saveComplete) {
      console.log('\n💾 Saving data to file...');
      // Ensure data directory exists
      await mkdir(outputDir, { recursive: true });

      if (saveSample) {
        await saveCardsToFile(supabaseCards, setCode, outputDir);
      }
      if (saveComplete) {
        await saveCompleteCardsToFile(supabaseCards, setCode, outputDir);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('✓ Import completed successfully!');
    console.log('='.repeat(60));
  } catch (error) {
    console.error('\n' + '='.repeat(60));
    console.error('✗ Import failed:');
    console.error('='.repeat(60));
    throw error;
  }
}

/**
 * CLI Entry Point
 */
async function main() {
  const args = process.argv.slice(2);

  // Parse command line arguments
  const setCodeArg = args.find(arg => !arg.startsWith('--'));
  const includeTokens = args.includes('--include-tokens');
  const includeVariations = args.includes('--include-variations');
  const refreshSet = args.includes('--refresh');
  const saveSample = args.includes('--save-sample');
  const saveComplete = args.includes('--save-complete');

  // Show usage if no set code provided
  if (!setCodeArg) {
    console.log(`
Scryfall to Supabase Card Importer
====================================

Usage:
  npm run import-set <set-code> [options]

Arguments:
  set-code              Three-letter Magic set code (e.g., dsk, blb, tla)

Options:
  --include-tokens      Include token cards in the import
  --include-variations  Include card variations (alternate art, etc.)
  --refresh             Delete existing cards from this set before importing
  --save-sample         Save first 5 cards to JSON file in ./data/
  --save-complete       Save all cards to JSON file in ./data/ (warning: large file!)

Examples:
  npm run import-set dsk
  npm run import-set blb --refresh
  npm run import-set tla --save-sample
  npm run import-set mh3 --include-tokens --include-variations
  npm run import-set otj --save-complete

Environment Variables (in .env.local):
  NEXT_PUBLIC_SUPABASE_URL          Your Supabase project URL
  SUPABASE_SERVICE_ROLE_KEY         Your Supabase service role key (recommended)
  NEXT_PUBLIC_SUPABASE_ANON_KEY     Your Supabase anon key (fallback)

Features:
  ✓ Single art per card (excludes variations by default)
  ✓ Excludes tokens by default
  ✓ Batch uploads for reliability
  ✓ Progress reporting
  ✓ Upsert to avoid duplicates
`);
    process.exit(1);
  }

  try {
    await importSetToSupabase({
      setCode: setCodeArg,
      includeTokens,
      includeVariations,
      refreshSet,
      saveSample,
      saveComplete,
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

// Export for programmatic usage
export { importSetToSupabase };
export type { ImportConfig };

// Auto-run if executed directly
main();
