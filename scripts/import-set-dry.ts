#!/usr/bin/env tsx

/**
 * Dry run script for the Scryfall set importer
 * 
 * This will fetch and transform data but NOT upload to Supabase
 * 
 * Usage: npm run import-set-dry [setcode]
 * Example: npm run import-set-dry dsk
 */

import { mkdir } from 'fs/promises';
import { readFile } from 'fs/promises';
import { importSet } from '../lib/services/scryfall.js';

// Load environment variables manually for Node.js scripts
async function loadEnvVariables() {
  try {
    const envContent = await readFile('.env.local', 'utf-8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^([^#][^=]*?)=(.*)$/);
      if (match) {
        const [, key, value] = match;
        const cleanKey = key.trim();
        const cleanValue = value.trim().replace(/^["']|["']$/g, '');
        if (!process.env[cleanKey]) {
          process.env[cleanKey] = cleanValue;
        }
      }
    });
  } catch (error) {
    console.warn('Could not load .env.local file:', (error as Error).message);
    console.warn('Make sure your environment variables are set manually');
  }
}

async function main() {
  const setCode = process.argv[2];
  
  if (!setCode) {
    console.error('Usage: npm run import-set-dry [setcode]');
    console.error('Example: npm run import-set-dry dsk');
    console.error('\nThis command will:');
    console.error('  ✅ Fetch data from Scryfall');
    console.error('  ✅ Transform data for your database');
    console.error('  ✅ Save sample to ./data/ folder');
    console.error('  ❌ NOT upload to Supabase');
    console.error('\nPopular recent sets:');
    console.error('  dsk - Duskmourn: House of Horror');
    console.error('  blb - Bloomburrow');
    console.error('  mh3 - Modern Horizons 3');
    console.error('  otj - Outlaws of Thunder Junction');
    process.exit(1);
  }
  
  try {
    // Load environment variables first
    await loadEnvVariables();
    
    // Ensure data directory exists
    await mkdir('./data', { recursive: true });
    
    console.log(`🧪 DRY RUN: Simulating import of set: ${setCode.toUpperCase()}`);
    console.log('(This will NOT upload to Supabase)\n');
    
    const result = await importSet(setCode, { 
      dryRun: true, 
      saveToFile: true,
      outputDir: './data'
    });
    
    console.log('\n🎉 Dry Run Summary:');
    console.log(`Set: ${result.setMetadata.name}`);
    console.log(`Cards processed: ${result.cardsImported}`);
    console.log(`Validation passed: ${result.validationPassed ? '✅' : '❌'}`);
    if (result.savedToFile) {
      console.log(`Sample saved to: ${result.savedToFile}`);
    }
    console.log('\n💡 To actually import to Supabase, use: npm run import-set ' + setCode);
    
  } catch (error) {
    console.error('\n❌ Dry run failed:', error);
    process.exit(1);
  }
}

main();