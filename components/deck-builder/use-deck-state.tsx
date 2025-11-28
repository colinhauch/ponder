'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Card, DeckCard } from '@/app/types';

interface DeckCardWithData extends DeckCard {
  card: Card;
}

interface UseDeckStateProps {
  deckId: string;
}

export function useDeckState({ deckId }: UseDeckStateProps) {
  const [mainDeck, setMainDeck] = useState<Map<string, DeckCardWithData>>(new Map());
  const [sideboard, setSideboard] = useState<Map<string, DeckCardWithData>>(new Map());
  const [format, setFormat] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch deck cards and deck metadata from database
  useEffect(() => {
    async function fetchDeckCards() {
      try {
        const supabase = createClient();

        // Fetch deck metadata (including format)
        const { data: deckData, error: deckError } = await supabase
          .from('decks')
          .select('format')
          .eq('id', deckId)
          .single();

        if (deckError) {
          console.error('Error fetching deck metadata:', deckError);
        } else {
          setFormat(deckData?.format || null);
        }

        // Fetch deck cards
        const { data, error: fetchError } = await supabase
          .from('deck_cards')
          .select('*, card:cards(*)')
          .eq('deck_id', deckId);

        if (fetchError) {
          console.error('Error fetching deck cards:', fetchError);
          setError('Failed to load deck');
          return;
        }

        // Separate main deck and sideboard
        const mainDeckMap = new Map<string, DeckCardWithData>();
        const sideboardMap = new Map<string, DeckCardWithData>();

        (data || []).forEach((deckCard: DeckCardWithData) => {
          const deckCardWithData: DeckCardWithData = {
            ...deckCard,
            card: deckCard.card,
          };

          if (deckCard.is_sideboard) {
            sideboardMap.set(deckCard.card_id, deckCardWithData);
          } else {
            mainDeckMap.set(deckCard.card_id, deckCardWithData);
          }
        });

        setMainDeck(mainDeckMap);
        setSideboard(sideboardMap);
      } catch (err) {
        console.error('Unexpected error fetching deck:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchDeckCards();
  }, [deckId]);

  // Add card to deck (or increment quantity)
  const addCard = useCallback(
    async (card: Card, isSideboard = false, quantity = 1) => {
      const supabase = createClient();
      const targetDeck = isSideboard ? sideboard : mainDeck;
      const setTargetDeck = isSideboard ? setSideboard : setMainDeck;

      const existingCard = targetDeck.get(card.id);

      if (existingCard) {
        // Increment quantity (max 4 for most cards, unlimited for basic lands)
        const isBasicLand = card.type_line.includes('Basic Land');
        const maxQuantity = isBasicLand ? 999 : 4;
        const newQuantity = Math.min(existingCard.quantity + quantity, maxQuantity);

        // Optimistic update
        const updatedCard = { ...existingCard, quantity: newQuantity };
        setTargetDeck((prev) => new Map(prev).set(card.id, updatedCard));

        // Update in database
        const { error: updateError } = await supabase
          .from('deck_cards')
          .update({ quantity: newQuantity })
          .eq('id', existingCard.id);

        if (updateError) {
          console.error('Error updating card quantity:', updateError);
          // Revert optimistic update
          setTargetDeck((prev) => new Map(prev).set(card.id, existingCard));
          return false;
        }
      } else {
        // Add new card
        const newDeckCard: DeckCardWithData = {
          id: crypto.randomUUID(), // Temporary ID for optimistic update
          deck_id: deckId,
          card_id: card.id,
          quantity,
          is_sideboard: isSideboard,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          card,
        };

        // Optimistic update
        setTargetDeck((prev) => new Map(prev).set(card.id, newDeckCard));

        // Insert into database
        const { data, error: insertError } = await supabase
          .from('deck_cards')
          .insert({
            deck_id: deckId,
            card_id: card.id,
            quantity,
            is_sideboard: isSideboard,
          })
          .select('*')
          .single();

        if (insertError) {
          console.error('Error adding card:', insertError);
          // Revert optimistic update
          setTargetDeck((prev) => {
            const newMap = new Map(prev);
            newMap.delete(card.id);
            return newMap;
          });
          return false;
        }

        // Update with real ID from database
        const finalDeckCard = { ...newDeckCard, ...data };
        setTargetDeck((prev) => new Map(prev).set(card.id, finalDeckCard));
      }

      return true;
    },
    [deckId, mainDeck, sideboard]
  );

  // Remove card from deck (or decrement quantity)
  const removeCard = useCallback(
    async (cardId: string, isSideboard = false, quantity = 1) => {
      const supabase = createClient();
      const targetDeck = isSideboard ? sideboard : mainDeck;
      const setTargetDeck = isSideboard ? setSideboard : setMainDeck;

      const existingCard = targetDeck.get(cardId);
      if (!existingCard) return false;

      if (existingCard.quantity > quantity) {
        // Decrement quantity
        const newQuantity = existingCard.quantity - quantity;
        const updatedCard = { ...existingCard, quantity: newQuantity };

        // Optimistic update
        setTargetDeck((prev) => new Map(prev).set(cardId, updatedCard));

        // Update in database
        const { error: updateError } = await supabase
          .from('deck_cards')
          .update({ quantity: newQuantity })
          .eq('id', existingCard.id);

        if (updateError) {
          console.error('Error updating card quantity:', updateError);
          // Revert optimistic update
          setTargetDeck((prev) => new Map(prev).set(cardId, existingCard));
          return false;
        }
      } else {
        // Remove card entirely
        // Optimistic update
        setTargetDeck((prev) => {
          const newMap = new Map(prev);
          newMap.delete(cardId);
          return newMap;
        });

        // Delete from database
        const { error: deleteError } = await supabase
          .from('deck_cards')
          .delete()
          .eq('id', existingCard.id);

        if (deleteError) {
          console.error('Error removing card:', deleteError);
          // Revert optimistic update
          setTargetDeck((prev) => new Map(prev).set(cardId, existingCard));
          return false;
        }
      }

      return true;
    },
    [mainDeck, sideboard]
  );

  // Update deck format
  const updateFormat = useCallback(
    async (newFormat: string | null) => {
      const supabase = createClient();

      // Optimistic update
      setFormat(newFormat);

      // Update database
      const { error: updateError } = await supabase
        .from('decks')
        .update({ format: newFormat })
        .eq('id', deckId);

      if (updateError) {
        console.error('Error updating deck format:', updateError);
        // Revert on error
        setFormat(format);
      }
    },
    [deckId, format]
  );

  // Get deck statistics
  const stats = {
    mainDeckCount: Array.from(mainDeck.values()).reduce((sum, card) => sum + card.quantity, 0),
    sideboardCount: Array.from(sideboard.values()).reduce((sum, card) => sum + card.quantity, 0),
    uniqueMainCards: mainDeck.size,
    uniqueSideCards: sideboard.size,
  };

  return {
    mainDeck,
    sideboard,
    format,
    loading,
    error,
    stats,
    addCard,
    removeCard,
    updateFormat,
  };
}
