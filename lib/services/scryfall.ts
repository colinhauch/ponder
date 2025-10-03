/**
 * Scryfall API integration service
 * 
 * Provides utilities for fetching card data from Scryfall API
 * and transforming it to match our database schema.
 */

// Scryfall API types based on their documentation
export interface ScryfallSet {
  id: string;
  code: string;
  name: string;
  uri: string;
  scryfall_uri: string;
  search_uri: string;
  released_at: string;
  set_type: string;
  card_count: number;
  digital: boolean;
  nonfoil_only: boolean;
  foil_only: boolean;
  icon_svg_uri: string;
}

export interface ScryfallCard {
  id: string;
  oracle_id: string;
  multiverse_ids: number[];
  mtgo_id?: number;
  mtgo_foil_id?: number;
  tcgplayer_id?: number;
  cardmarket_id?: number;
  name: string;
  lang: string;
  released_at: string;
  uri: string;
  scryfall_uri: string;
  layout: string;
  highres_image: boolean;
  image_status: string;
  image_uris?: {
    small: string;
    normal: string;
    large: string;
    png: string;
    art_crop: string;
    border_crop: string;
  };
  mana_cost?: string;
  cmc: number;
  type_line: string;
  oracle_text?: string;
  power?: string;
  toughness?: string;
  colors?: string[];
  color_identity: string[];
  keywords: string[];
  legalities: Record<string, string>;
  games: string[];
  reserved: boolean;
  foil: boolean;
  nonfoil: boolean;
  finishes: string[];
  oversized: boolean;
  promo: boolean;
  reprint: boolean;
  variation: boolean;
  set_id: string;
  set: string;
  set_name: string;
  set_type: string;
  set_uri: string;
  set_search_uri: string;
  scryfall_set_uri: string;
  rulings_uri: string;
  prints_search_uri: string;
  collector_number: string;
  digital: boolean;
  rarity: string;
  card_back_id?: string;
  artist?: string;
  artist_ids?: string[];
  illustration_id?: string;
  border_color: string;
  frame: string;
  security_stamp?: string;
  full_art: boolean;
  textless: boolean;
  booster: boolean;
  story_spotlight: boolean;
  edhrec_rank?: number;
  penny_rank?: number;
  preview?: {
    source: string;
    source_uri: string;
    previewed_at: string;
  };
  prices: {
    usd?: string;
    usd_foil?: string;
    usd_etched?: string;
    eur?: string;
    eur_foil?: string;
    tix?: string;
  };
  related_uris: {
    gatherer?: string;
    tcgplayer_infinite_articles?: string;
    tcgplayer_infinite_decks?: string;
    edhrec?: string;
  };
  purchase_uris: {
    tcgplayer?: string;
    cardmarket?: string;
    cardhoarder?: string;
  };
}

export interface ScryfallSearchResponse {
  object: "list";
  total_cards: number;
  has_more: boolean;
  next_page?: string;
  data: ScryfallCard[];
  warnings?: string[];
}

export interface ScryfallError {
  object: "error";
  code: string;
  status: number;
  warnings?: string[];
  details: string;
}

// API configuration
const SCRYFALL_API_BASE = "https://api.scryfall.com";
const REQUEST_DELAY = 100; // Scryfall requests to be 50-100ms apart

// Rate limiting utility
let lastRequestTime = 0;

async function rateLimitedFetch(url: string): Promise<Response> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < REQUEST_DELAY) {
    await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY - timeSinceLastRequest));
  }
  
  lastRequestTime = Date.now();
  
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'MTG-Deck-Builder-Assistant/1.0',
    },
  });
  
  if (!response.ok) {
    const errorData: ScryfallError = await response.json();
    throw new Error(`Scryfall API error: ${errorData.details} (${errorData.code})`);
  }
  
  return response;
}

/**
 * Fetch set metadata from Scryfall
 */
export async function fetchSetMetadata(setCode: string): Promise<ScryfallSet> {
  const url = `${SCRYFALL_API_BASE}/sets/${setCode}`;
  const response = await rateLimitedFetch(url);
  return response.json();
}

/**
 * Search for cards in a specific set
 */
export async function searchCardsInSet(setCode: string): Promise<ScryfallCard[]> {
  const cards: ScryfallCard[] = [];
  let nextPageUrl: string | undefined = `${SCRYFALL_API_BASE}/cards/search?q=set:${setCode}&unique=prints&order=set`;
  
  while (nextPageUrl) {
    const response = await rateLimitedFetch(nextPageUrl);
    const searchResponse: ScryfallSearchResponse = await response.json();
    
    cards.push(...searchResponse.data);
    nextPageUrl = searchResponse.next_page;
    
    // Log progress for large sets
    if (searchResponse.has_more) {
      console.log(`Fetched ${cards.length}/${searchResponse.total_cards} cards from ${setCode}...`);
    }
  }
  
  console.log(`Successfully fetched ${cards.length} cards from set ${setCode}`);
  return cards;
}

/**
 * Validate that we got all cards from a set by comparing counts
 */
export async function validateSetImport(setCode: string, fetchedCards: ScryfallCard[]): Promise<boolean> {
  const setMetadata = await fetchSetMetadata(setCode);
  const expectedCount = setMetadata.card_count;
  const actualCount = fetchedCards.length;
  
  if (expectedCount !== actualCount) {
    console.warn(
      `Card count mismatch for set ${setCode}: expected ${expectedCount}, got ${actualCount}`
    );
    return false;
  }
  
  console.log(`✅ Set ${setCode} validation passed: ${actualCount}/${expectedCount} cards`);
  return true;
}

// Database types for card transformation
import type { Database } from "../types/database";

type DatabaseCard = Database["public"]["Tables"]["cards"]["Insert"];

/**
 * Transform a Scryfall card to our database schema
 */
export function transformCardForDatabase(scryfallCard: ScryfallCard): DatabaseCard {
  return {
    scryfall_id: scryfallCard.id,
    name: scryfallCard.name,
    mana_cost: scryfallCard.mana_cost || null,
    cmc: scryfallCard.cmc,
    type_line: scryfallCard.type_line,
    colors: scryfallCard.colors || null,
    color_identity: scryfallCard.color_identity || null,
    power: scryfallCard.power || null,
    toughness: scryfallCard.toughness || null,
    rarity: scryfallCard.rarity,
    set_code: scryfallCard.set,
    collector_number: scryfallCard.collector_number || null,
    keywords: scryfallCard.keywords.join(", "),
    image_uris: scryfallCard.image_uris || null,
  };
}

/**
 * Transform multiple Scryfall cards to database format
 */
export function transformCardsForDatabase(scryfallCards: ScryfallCard[]): DatabaseCard[] {
  return scryfallCards.map(transformCardForDatabase);
}

import { createClient } from "@supabase/supabase-js";
import { writeFile } from "fs/promises";
import { join } from "path";

/**
 * Create Supabase client for Node.js scripts
 * Handles environment variable loading for script execution
 */
function createScriptClient() {
  // For Node.js scripts, we need to ensure environment variables are available
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY;
  
  if (!url || !key) {
    throw new Error(
      'Missing Supabase environment variables. Please check your .env.local file contains:\n' +
      '- NEXT_PUBLIC_SUPABASE_URL\n' +
      '- NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY'
    );
  }
  
  // Create client directly with environment variables
  return createClient(url, key);
}

/**
 * Save cards to a local JSON file for inspection
 */
export async function saveCardsToFile(
  cards: DatabaseCard[], 
  setCode: string, 
  outputDir: string = "./data"
): Promise<string> {
  const fileName = `${setCode}-cards-${new Date().toISOString().split('T')[0]}.json`;
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
 * Save complete dataset to file (be careful with large sets!)
 */
export async function saveCompleteCardsToFile(
  cards: DatabaseCard[], 
  setCode: string, 
  outputDir: string = "./data"
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
 * Upload cards to Supabase in batches
 * For scripts, we'll create the client directly to avoid server dependency
 */
export async function uploadCardsToDatabase(cards: DatabaseCard[], batchSize: number = 1000): Promise<void> {
  // For script usage, use the script client that handles environment variables properly
  const supabase = createScriptClient();
  
  console.log(`Uploading ${cards.length} cards to database in batches of ${batchSize}...`);
  
  for (let i = 0; i < cards.length; i += batchSize) {
    const batch = cards.slice(i, i + batchSize);
    const batchNumber = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(cards.length / batchSize);
    
    console.log(`Uploading batch ${batchNumber}/${totalBatches} (${batch.length} cards)...`);
    
    const { error } = await supabase
      .from("cards")
      .upsert(batch, { 
        onConflict: "scryfall_id",
        ignoreDuplicates: false 
      });
    
    if (error) {
      console.error(`Error uploading batch ${batchNumber}:`, error);
      throw new Error(`Failed to upload cards batch ${batchNumber}: ${error.message}`);
    }
    
    console.log(`✅ Batch ${batchNumber}/${totalBatches} uploaded successfully`);
  }
  
  console.log(`🎉 Successfully uploaded all ${cards.length} cards to database`);
}

/**
 * Complete set import pipeline
 */
export async function importSet(
  setCode: string, 
  options: {
    dryRun?: boolean;
    saveToFile?: boolean;
    outputDir?: string;
  } = {}
): Promise<{
  setMetadata: ScryfallSet;
  cardsImported: number;
  validationPassed: boolean;
  savedToFile?: string;
}> {
  const { dryRun = false, saveToFile = false, outputDir = "./data" } = options;
  
  console.log(`🚀 Starting import of set: ${setCode} ${dryRun ? '(DRY RUN)' : ''}`);
  
  try {
    // Step 1: Fetch set metadata
    console.log("📋 Fetching set metadata...");
    const setMetadata = await fetchSetMetadata(setCode);
    console.log(`Set: ${setMetadata.name} (${setMetadata.card_count} cards)`);
    
    // Step 2: Fetch all cards in the set
    console.log("🃏 Fetching cards from Scryfall...");
    const scryfallCards = await searchCardsInSet(setCode);
    
    // Step 3: Validate card count
    console.log("✅ Validating card count...");
    const validationPassed = await validateSetImport(setCode, scryfallCards);
    
    if (!validationPassed) {
      console.warn("⚠️  Validation failed, but continuing...");
    }
    
    // Step 4: Transform cards for database
    console.log("🔄 Transforming cards for database...");
    const databaseCards = transformCardsForDatabase(scryfallCards);
    
    console.log(`\n📊 Data Summary:`);
    console.log(`  Set: ${setMetadata.name}`);
    console.log(`  Cards: ${databaseCards.length}`);
    console.log(`  Sample card fields:`);
    if (databaseCards.length > 0) {
      const sampleCard = databaseCards[0];
      console.log(`    Name: ${sampleCard.name}`);
      console.log(`    Mana Cost: ${sampleCard.mana_cost || 'N/A'}`);
      console.log(`    Type: ${sampleCard.type_line}`);
      console.log(`    Rarity: ${sampleCard.rarity}`);
      console.log(`    Set: ${sampleCard.set_code}`);
    }
    
    let savedToFile: string | undefined;
    
    // Step 5: Save to file if requested
    if (saveToFile) {
      console.log("\n💾 Saving data to file...");
      savedToFile = await saveCardsToFile(databaseCards, setCode, outputDir);
    }
    
    // Step 6: Upload to database (unless dry run)
    if (dryRun) {
      console.log("\n🧪 DRY RUN: Would upload to database but skipping...");
      console.log(`   Would insert ${databaseCards.length} cards into Supabase`);
    } else {
      console.log("\n💾 Uploading cards to database...");
      await uploadCardsToDatabase(databaseCards);
    }
    
    console.log(`\n🎉 Set ${setCode} import ${dryRun ? 'simulation' : ''} completed successfully!`);
    
    return {
      setMetadata,
      cardsImported: databaseCards.length,
      validationPassed,
      savedToFile,
    };
    
  } catch (error) {
    console.error(`❌ Failed to import set ${setCode}:`, error);
    throw error;
  }
}