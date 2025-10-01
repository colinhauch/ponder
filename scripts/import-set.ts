#!/usr/bin/env tsx

/**
 * Import script for the Scryfall set importer
 * 
 * This will fetch, transform, and upload data to Supabase
 * 
 * Usage: npm run import-set [setcode]
 * Example: npm run import-set dsk
 */

import { mkdir } from 'fs/promises';
import { importSet } from '../lib/services/scryfall.js';

async function main() {
  const setCode = process.argv[2];
  
  if (!setCode) {
    console.error('Usage: npm run import-set [setcode]');
    console.error('Example: npm run import-set dsk');
    console.error('\nThis command will:');
    console.error('  ✅ Fetch data from Scryfall');
    console.error('  ✅ Transform data for your database');
    console.error('  ✅ Upload to Supabase database');
    console.error('\nPopular recent sets:');
    console.error('  dsk - Duskmourn: House of Horror');
    console.error('  blb - Bloomburrow');
    console.error('  mh3 - Modern Horizons 3');
    console.error('  otj - Outlaws of Thunder Junction');
    process.exit(1);
  }
  
  try {
    // Ensure data directory exists
    await mkdir('./data', { recursive: true });
    
    console.log(`🚀 Starting import of set: ${setCode.toUpperCase()}`);
    console.log('(This WILL upload to Supabase)\n');
    
    const result = await importSet(setCode, { 
      dryRun: false, 
      saveToFile: true,
      outputDir: './data'
    });
    
    console.log('\n🎉 Import Summary:');
    console.log(`Set: ${result.setMetadata.name}`);
    console.log(`Cards imported: ${result.cardsImported}`);
    console.log(`Validation passed: ${result.validationPassed ? '✅' : '❌'}`);
    if (result.savedToFile) {
      console.log(`Sample saved to: ${result.savedToFile}`);
    }
    
  } catch (error) {
    console.error('\n❌ Import failed:', error);
    process.exit(1);
  }
}

main();