'use client';

import { useState, useEffect } from 'react';
import { Paper, Title, Stack, Loader, Center, Text } from '@mantine/core';
import { createClient } from '@/lib/supabase/client';
import { CardGrid } from './card-grid';
import { CardFiltersUI } from './card-filters';
import { useCardFilters } from './use-card-filters';
import type { Card } from '@/app/types';

interface CardPoolPaneProps {
  onCardDragStart?: (card: Card) => void;
  onCardClick?: (card: Card) => void;
  onCardContextMenu?: (card: Card, event: React.MouseEvent) => void;
}

export function CardPoolPane({
  onCardDragStart,
  onCardClick,
  onCardContextMenu,
}: CardPoolPaneProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    filters,
    filteredCards,
    updateFilter,
    resetFilters,
    toggleColor,
    toggleType,
    toggleRarity,
  } = useCardFilters(cards);

  useEffect(() => {
    async function fetchCards() {
      try {
        const supabase = createClient();

        // Fetch all cards from the database
        // TODO: In the future, we might want to filter by user's collection
        const { data, error: fetchError } = await supabase
          .from('cards')
          .select('*')
          .order('name', { ascending: true });

        if (fetchError) {
          console.error('Error fetching cards:', fetchError);
          setError('Failed to load cards');
          return;
        }

        setCards(data || []);
      } catch (err) {
        console.error('Unexpected error fetching cards:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchCards();
  }, []);

  // Convert filtered cards to CardWithQuantity format (all quantity 1 for card pool)
  const cardsWithQuantity = filteredCards.map((card) => ({
    card,
    quantity: 1,
  }));

  return (
    <Paper shadow="sm" p="md" withBorder h="100%" style={{ display: 'flex', flexDirection: 'column' }}>
      <Stack gap="md" style={{ height: '100%' }}>
        <Title order={3}>Card Pool</Title>

        {loading ? (
          <Center style={{ flex: 1 }}>
            <Stack align="center" gap="sm">
              <Loader size="lg" />
              <Text size="sm" c="dimmed">Loading cards...</Text>
            </Stack>
          </Center>
        ) : error ? (
          <Center style={{ flex: 1 }}>
            <Text c="red" size="sm">{error}</Text>
          </Center>
        ) : (
          <>
            <CardFiltersUI
              filters={filters}
              onSearchChange={(value) => updateFilter('searchText', value)}
              onColorToggle={toggleColor}
              onTypeToggle={toggleType}
              onRarityToggle={toggleRarity}
              onCmcMinChange={(value) => updateFilter('cmcMin', value)}
              onCmcMaxChange={(value) => updateFilter('cmcMax', value)}
              onColorModeChange={(mode) => updateFilter('colorFilterMode', mode)}
              onReset={resetFilters}
              resultsCount={filteredCards.length}
            />

            <div style={{ flex: 1, overflow: 'hidden' }}>
              <CardGrid
                cards={cardsWithQuantity}
                cardSize="small"
                columnsCount={5}
                draggable={true}
                onCardDragStart={onCardDragStart}
                onCardClick={onCardClick}
                onCardContextMenu={onCardContextMenu}
                emptyMessage="No cards match your filters"
              />
            </div>
          </>
        )}
      </Stack>
    </Paper>
  );
}
