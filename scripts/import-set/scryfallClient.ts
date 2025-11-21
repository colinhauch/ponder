import { ScryfallCard, ScryfallSearchResponse } from './types';

const SCRYFALL_API_BASE = 'https://api.scryfall.com';
const RATE_LIMIT_DELAY = 100; // Scryfall recommends 50-100ms between requests

/**
 * Client for interacting with the Scryfall API
 */
export class ScryfallClient {
  private lastRequestTime = 0;

  /**
   * Delays the request to respect Scryfall's rate limits
   */
  private async respectRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
      await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY - timeSinceLastRequest));
    }

    this.lastRequestTime = Date.now();
  }

  /**
   * Fetches all cards from a specific set
   * @param setCode The three-letter set code (e.g., 'dsk', 'blb', 'tla')
   * @param options Additional search options
   * @returns Array of all cards in the set
   */
  async getCardsBySet(
    setCode: string,
    options: {
      includeTokens?: boolean;
      includeVariations?: boolean;
    } = {}
  ): Promise<ScryfallCard[]> {
    const cards: ScryfallCard[] = [];
    let searchQuery = `set:${setCode}`;

    // Exclude tokens by default
    if (!options.includeTokens) {
      searchQuery += ' -type:token';
    }

    // Exclude variations by default (gives single art per card)
    if (!options.includeVariations) {
      searchQuery += ' -is:variation';
    }

    let nextPage: string | undefined = `${SCRYFALL_API_BASE}/cards/search?q=${encodeURIComponent(searchQuery)}`;

    console.log(`Fetching cards for set: ${setCode}`);

    while (nextPage) {
      await this.respectRateLimit();

      const response = await fetch(nextPage);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Set code "${setCode}" not found. Please check the set code and try again.`);
        }
        throw new Error(`Scryfall API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as ScryfallSearchResponse;
      cards.push(...data.data);

      console.log(`Fetched ${cards.length} of ${data.total_cards} cards...`);

      nextPage = data.next_page;
    }

    console.log(`Successfully fetched ${cards.length} cards from set ${setCode}`);
    return cards;
  }
}
