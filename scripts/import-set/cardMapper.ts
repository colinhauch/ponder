import { ScryfallCard, SupabaseCard } from './types';

/**
 * Maps Scryfall card data to Supabase schema
 */
export function mapScryfallCardToSupabase(scryfallCard: ScryfallCard): SupabaseCard {
  return {
    scryfall_id: scryfallCard.id,
    name: scryfallCard.name,
    mana_cost: scryfallCard.mana_cost,
    cmc: scryfallCard.cmc,
    type_line: scryfallCard.type_line,
    colors: scryfallCard.colors,
    color_identity: scryfallCard.color_identity,
    power: scryfallCard.power,
    toughness: scryfallCard.toughness,
    // Join keywords array into a string
    keywords: scryfallCard.keywords.join(', '),
    rarity: scryfallCard.rarity,
    set_code: scryfallCard.set,
    collector_number: scryfallCard.collector_number,
    // Store all image URIs as JSONB
    image_uris: scryfallCard.image_uris ? {
      small: scryfallCard.image_uris.small,
      normal: scryfallCard.image_uris.normal,
      large: scryfallCard.image_uris.large,
      png: scryfallCard.image_uris.png,
      art_crop: scryfallCard.image_uris.art_crop,
      border_crop: scryfallCard.image_uris.border_crop,
    } : undefined,
  };
}

/**
 * Batch maps multiple cards
 */
export function mapCardsToSupabase(scryfallCards: ScryfallCard[]): SupabaseCard[] {
  return scryfallCards.map(mapScryfallCardToSupabase);
}
