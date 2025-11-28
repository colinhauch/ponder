import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SupabaseCard } from './types';

/**
 * Client for uploading cards to Supabase
 */
export class SupabaseCardImporter {
  private supabase: SupabaseClient;
  private tableName: string;

  constructor(supabaseUrl: string, supabaseKey: string, tableName: string = 'cards') {
    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.tableName = tableName;
  }

  /**
   * Uploads cards to Supabase in batches
   * Uses upsert to avoid duplicates based on scryfall_id
   */
  async uploadCards(cards: SupabaseCard[], batchSize: number = 100): Promise<void> {
    console.log(`Uploading ${cards.length} cards to Supabase...`);

    // Process in batches to avoid overwhelming the database
    for (let i = 0; i < cards.length; i += batchSize) {
      const batch = cards.slice(i, i + batchSize);

      const { error } = await this.supabase
        .from(this.tableName)
        .upsert(batch, {
          onConflict: 'scryfall_id', // Assumes scryfall_id is a unique constraint
        });

      if (error) {
        throw new Error(`Failed to upload cards: ${error.message}`);
      }

      console.log(`Uploaded batch ${Math.floor(i / batchSize) + 1} (${Math.min(i + batchSize, cards.length)}/${cards.length} cards)`);
    }

    console.log(`Successfully uploaded ${cards.length} cards to Supabase!`);
  }

  /**
   * Deletes all cards from a specific set
   * Useful if you want to re-import a set
   */
  async deleteCardsBySet(setCode: string): Promise<number> {
    console.log(`Deleting cards from set ${setCode}...`);

    const { error, count } = await this.supabase
      .from(this.tableName)
      .delete()
      .eq('set_code', setCode);

    if (error) {
      throw new Error(`Failed to delete cards: ${error.message}`);
    }

    console.log(`Deleted ${count || 0} cards from set ${setCode}`);
    return count || 0;
  }

  /**
   * Gets count of cards in a specific set
   */
  async getSetCardCount(setCode: string): Promise<number> {
    const { count, error } = await this.supabase
      .from(this.tableName)
      .select('*', { count: 'exact', head: true })
      .eq('set_code', setCode);

    if (error) {
      throw new Error(`Failed to count cards: ${error.message}`);
    }

    return count || 0;
  }
}
