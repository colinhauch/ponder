'use client';

import { useMemo, useState } from 'react';
import { Paper, Title, Stack, Text, Group, Badge, Divider, Loader, Center, Select, SegmentedControl, Indicator } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import { CardGrid } from './card-grid';
import type { Card } from '@/app/types';

interface DeckCardWithData {
  card: Card;
  quantity: number;
}

interface CurrentDeckPaneProps {
  mainDeck: Map<string, DeckCardWithData>;
  sideboard: Map<string, DeckCardWithData>;
  loading?: boolean;
  format?: string | null;
  onFormatChange?: (format: string | null) => void;
  onCardClick?: (card: Card) => void;
  onCardContextMenu?: (card: Card) => void;
  onCardDragStart?: (card: Card) => void;
  onDrop?: (isSideboard: boolean) => void;
}

const MTG_FORMATS = [
  { value: 'standard', label: 'Standard' },
  { value: 'pioneer', label: 'Pioneer' },
  { value: 'modern', label: 'Modern' },
  { value: 'legacy', label: 'Legacy' },
  { value: 'vintage', label: 'Vintage' },
  { value: 'commander', label: 'Commander' },
  { value: 'pauper', label: 'Pauper' },
  { value: 'limited', label: 'Limited' },
];

export function CurrentDeckPane({
  mainDeck,
  sideboard,
  loading = false,
  format = null,
  onFormatChange,
  onCardClick,
  onCardContextMenu,
  onCardDragStart,
  onDrop,
}: CurrentDeckPaneProps) {
  const [viewMode, setViewMode] = useState<'main' | 'sideboard'>('main');

  // Calculate statistics
  const mainDeckCount = Array.from(mainDeck.values()).reduce((sum, card) => sum + card.quantity, 0);
  const sideboardCount = Array.from(sideboard.values()).reduce((sum, card) => sum + card.quantity, 0);

  // TODO: Implement actual deck legality checking logic
  // For now, this is just placeholder UI
  const isLegal = mainDeckCount >= 40; // Simplified placeholder logic

  // Group cards by type and sort by CMC
  const groupedMainDeck = useMemo(() => {
    const cards = Array.from(mainDeck.values());

    const creatures = cards.filter((c) => c.card.type_line.includes('Creature'));
    const planeswalkers = cards.filter((c) => c.card.type_line.includes('Planeswalker'));
    const instants = cards.filter((c) => c.card.type_line.includes('Instant'));
    const sorceries = cards.filter((c) => c.card.type_line.includes('Sorcery'));
    const enchantments = cards.filter(
      (c) => c.card.type_line.includes('Enchantment') && !c.card.type_line.includes('Creature')
    );
    const artifacts = cards.filter(
      (c) => c.card.type_line.includes('Artifact') && !c.card.type_line.includes('Creature')
    );
    const lands = cards.filter((c) => c.card.type_line.includes('Land'));
    const other = cards.filter(
      (c) =>
        !c.card.type_line.includes('Creature') &&
        !c.card.type_line.includes('Planeswalker') &&
        !c.card.type_line.includes('Instant') &&
        !c.card.type_line.includes('Sorcery') &&
        !c.card.type_line.includes('Enchantment') &&
        !c.card.type_line.includes('Artifact') &&
        !c.card.type_line.includes('Land')
    );

    const sortByCmc = (a: DeckCardWithData, b: DeckCardWithData) => {
      if (a.card.cmc !== b.card.cmc) return a.card.cmc - b.card.cmc;
      return a.card.name.localeCompare(b.card.name);
    };

    return [
      { type: 'Creatures', cards: creatures.sort(sortByCmc) },
      { type: 'Planeswalkers', cards: planeswalkers.sort(sortByCmc) },
      { type: 'Instants', cards: instants.sort(sortByCmc) },
      { type: 'Sorceries', cards: sorceries.sort(sortByCmc) },
      { type: 'Enchantments', cards: enchantments.sort(sortByCmc) },
      { type: 'Artifacts', cards: artifacts.sort(sortByCmc) },
      { type: 'Lands', cards: lands.sort(sortByCmc) },
      { type: 'Other', cards: other.sort(sortByCmc) },
    ].filter((group) => group.cards.length > 0);
  }, [mainDeck]);

  // Group sideboard cards by type just like main deck
  const groupedSideboard = useMemo(() => {
    const cards = Array.from(sideboard.values());

    const creatures = cards.filter((c) => c.card.type_line.includes('Creature'));
    const planeswalkers = cards.filter((c) => c.card.type_line.includes('Planeswalker'));
    const instants = cards.filter((c) => c.card.type_line.includes('Instant'));
    const sorceries = cards.filter((c) => c.card.type_line.includes('Sorcery'));
    const enchantments = cards.filter(
      (c) => c.card.type_line.includes('Enchantment') && !c.card.type_line.includes('Creature')
    );
    const artifacts = cards.filter(
      (c) => c.card.type_line.includes('Artifact') && !c.card.type_line.includes('Creature')
    );
    const lands = cards.filter((c) => c.card.type_line.includes('Land'));
    const other = cards.filter(
      (c) =>
        !c.card.type_line.includes('Creature') &&
        !c.card.type_line.includes('Planeswalker') &&
        !c.card.type_line.includes('Instant') &&
        !c.card.type_line.includes('Sorcery') &&
        !c.card.type_line.includes('Enchantment') &&
        !c.card.type_line.includes('Artifact') &&
        !c.card.type_line.includes('Land')
    );

    const sortByCmc = (a: DeckCardWithData, b: DeckCardWithData) => {
      if (a.card.cmc !== b.card.cmc) return a.card.cmc - b.card.cmc;
      return a.card.name.localeCompare(b.card.name);
    };

    return [
      { type: 'Creatures', cards: creatures.sort(sortByCmc) },
      { type: 'Planeswalkers', cards: planeswalkers.sort(sortByCmc) },
      { type: 'Instants', cards: instants.sort(sortByCmc) },
      { type: 'Sorceries', cards: sorceries.sort(sortByCmc) },
      { type: 'Enchantments', cards: enchantments.sort(sortByCmc) },
      { type: 'Artifacts', cards: artifacts.sort(sortByCmc) },
      { type: 'Lands', cards: lands.sort(sortByCmc) },
      { type: 'Other', cards: other.sort(sortByCmc) },
    ].filter((group) => group.cards.length > 0);
  }, [sideboard]);

  const currentDeckGroups = viewMode === 'main' ? groupedMainDeck : groupedSideboard;
  const currentDeckCount = viewMode === 'main' ? mainDeckCount : sideboardCount;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (onDrop) {
      // Pass the current view mode to determine if card should go to sideboard
      onDrop(viewMode === 'sideboard');
    }
  };

  if (loading) {
    return (
      <Paper shadow="sm" p="md" withBorder h="100%">
        <Center h="100%">
          <Stack align="center" gap="sm">
            <Loader size="lg" />
            <Text size="sm" c="dimmed">Loading deck...</Text>
          </Stack>
        </Center>
      </Paper>
    );
  }

  return (
    <Paper
      shadow="sm"
      p="md"
      withBorder
      h="100%"
      style={{ display: 'flex', flexDirection: 'column' }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Stack gap="md" style={{ height: '100%', overflow: 'hidden' }}>
        <Stack gap="sm">
          <Group justify="space-between" align="center">
            <Title order={3}>Current Deck</Title>
            <Group gap="xs">
              <Badge variant="filled" size="lg">
                Main: {mainDeckCount}
              </Badge>
              {sideboardCount > 0 && (
                <Badge variant="outline" size="lg">
                  Side: {sideboardCount}
                </Badge>
              )}
            </Group>
          </Group>

          <Group gap="sm" align="center" wrap="nowrap">
            <Select
              placeholder="Select format"
              data={MTG_FORMATS}
              value={format}
              onChange={onFormatChange}
              size="xs"
              style={{ flex: 1, minWidth: 120 }}
              clearable
            />

            {format && (
              <Group gap="xs" wrap="nowrap" style={{ flexShrink: 0 }}>
                {isLegal ? (
                  <>
                    <IconCheck size={16} color="var(--mantine-color-green-6)" />
                    <Text size="xs" c="green">Legal</Text>
                  </>
                ) : (
                  <>
                    <IconX size={16} color="var(--mantine-color-red-6)" />
                    <Text size="xs" c="red">Not Legal</Text>
                  </>
                )}
              </Group>
            )}

            <SegmentedControl
              value={viewMode}
              onChange={(value) => setViewMode(value as 'main' | 'sideboard')}
              data={[
                { label: 'Main', value: 'main' },
                { label: 'Sideboard', value: 'sideboard' },
              ]}
              size="xs"
              style={{ flexShrink: 0 }}
            />
          </Group>
        </Stack>

        <div style={{ flex: 1, overflow: 'auto' }}>
          {currentDeckCount === 0 ? (
            <Center h="100%">
              <Stack align="center" gap="xs">
                <Text c="dimmed" size="sm">
                  {viewMode === 'main' ? 'Your deck is empty' : 'Your sideboard is empty'}
                </Text>
                <Text c="dimmed" size="xs">
                  Drag cards from the card pool to add them
                </Text>
              </Stack>
            </Center>
          ) : (
            <Stack gap="lg">
              {/* Current view (Main or Sideboard) by Type */}
              {currentDeckGroups.map((group) => (
                <div key={group.type}>
                  <Group gap="xs" mb="xs">
                    <Text size="sm" fw={600}>
                      {group.type}
                    </Text>
                    <Badge size="sm" variant="light">
                      {group.cards.reduce((sum, c) => sum + c.quantity, 0)}
                    </Badge>
                  </Group>
                  <CardGrid
                    cards={group.cards.map((dc) => ({ card: dc.card, quantity: dc.quantity }))}
                    cardSize="small"
                    columnsCount={6}
                    draggable={true}
                    onCardDragStart={onCardDragStart}
                    onCardClick={onCardClick}
                    onCardContextMenu={onCardContextMenu}
                  />
                </div>
              ))}
            </Stack>
          )}
        </div>
      </Stack>
    </Paper>
  );
}
