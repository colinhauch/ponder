import { ScryfallCard, SupabaseCard } from './types';

/**
 * Maps Scryfall card data to Supabase schema
 * For double-faced cards, stores front face in image_uris and back face in back_image_uris
 */
export function mapScryfallCardToSupabase(scryfallCard: ScryfallCard): SupabaseCard {
  // For double-faced cards, image_uris is in card_faces[0]
  // For single-faced cards, it's at the root level
  const imageSource = scryfallCard.image_uris || scryfallCard.card_faces?.[0]?.image_uris;

  // Extract back face image URIs for double-faced cards (full object)
  const backImageSource = scryfallCard.card_faces?.[1]?.image_uris;

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
    // Store card layout type (normal, transform, modal_dfc, etc.)
    layout: scryfallCard.layout,
    // Store back face image URIs for double-faced cards (full object)
    back_image_uris: backImageSource ? {
      small: backImageSource.small,
      normal: backImageSource.normal,
      large: backImageSource.large,
      png: backImageSource.png,
      art_crop: backImageSource.art_crop,
      border_crop: backImageSource.border_crop,
    } : undefined,
    // Store all image URIs as JSONB (front face for DFCs)
    image_uris: imageSource ? {
      small: imageSource.small,
      normal: imageSource.normal,
      large: imageSource.large,
      png: imageSource.png,
      art_crop: imageSource.art_crop,
      border_crop: imageSource.border_crop,
    } : undefined,
  };
}

/**
 * Batch maps multiple cards
 */
export function mapCardsToSupabase(scryfallCards: ScryfallCard[]): SupabaseCard[] {
  return scryfallCards.map(mapScryfallCardToSupabase);
}
