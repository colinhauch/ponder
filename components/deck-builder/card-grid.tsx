'use client';

import { useRef, useMemo } from 'react';
import { Box, Text, Center } from '@mantine/core';
import { useVirtualizer } from '@tanstack/react-virtual';
import { MTGCard } from './mtg-card';
import type { Card } from '@/app/types';

interface CardWithQuantity {
  card: Card;
  quantity: number;
}

interface CardGridProps {
  cards: CardWithQuantity[];
  cardSize?: 'small' | 'medium' | 'large';
  columnsCount?: number;
  draggable?: boolean;
  onCardDragStart?: (card: Card) => void;
  onCardClick?: (card: Card) => void;
  onCardContextMenu?: (card: Card, event: React.MouseEvent) => void;
  emptyMessage?: string;
}

export function CardGrid({
  cards,
  cardSize = 'small',
  columnsCount = 4,
  draggable = false,
  onCardDragStart,
  onCardClick,
  onCardContextMenu,
  emptyMessage = 'No cards to display',
}: CardGridProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  // Calculate card dimensions based on size (63:88 ratio for MTG cards)
  const cardDimensions = {
    small: { width: 120, height: 168 },
    medium: { width: 180, height: 251 },
    large: { width: 240, height: 335 },
  }[cardSize];

  const gap = 12;
  const rowHeight = cardDimensions.height + gap;

  // Group cards into rows
  const rows = useMemo(() => {
    const result: CardWithQuantity[][] = [];
    for (let i = 0; i < cards.length; i += columnsCount) {
      result.push(cards.slice(i, i + columnsCount));
    }
    return result;
  }, [cards, columnsCount]);

  // Setup virtual scrolling
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan: 2,
  });

  if (cards.length === 0) {
    return (
      <Center h="100%">
        <Text c="dimmed" size="sm">
          {emptyMessage}
        </Text>
      </Center>
    );
  }

  return (
    <Box
      ref={parentRef}
      style={{
        height: '100%',
        width: '100%',
        overflow: 'auto',
      }}
    >
      <Box
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const row = rows[virtualRow.index];
          return (
            <Box
              key={virtualRow.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
                display: 'flex',
                gap: `${gap}px`,
              }}
            >
              {row.map(({ card, quantity }) => (
                <MTGCard
                  key={card.id}
                  card={card}
                  quantity={quantity}
                  size={cardSize}
                  draggable={draggable}
                  onDragStart={onCardDragStart}
                  onClick={onCardClick}
                  onContextMenu={onCardContextMenu}
                />
              ))}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
