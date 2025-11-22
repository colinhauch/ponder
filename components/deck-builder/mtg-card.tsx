'use client';

import { useState } from 'react';
import { Box, Text, Badge, Tooltip } from '@mantine/core';
import Image from 'next/image';
import type { Card } from '@/app/types';

interface MTGCardProps {
  card: Card;
  quantity?: number;
  size?: 'small' | 'medium' | 'large';
  draggable?: boolean;
  onDragStart?: (card: Card) => void;
  onClick?: (card: Card) => void;
  onContextMenu?: (card: Card, event: React.MouseEvent) => void;
}

export function MTGCard({
  card,
  quantity = 1,
  size = 'medium',
  draggable = false,
  onDragStart,
  onClick,
  onContextMenu,
}: MTGCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [showBackFace, setShowBackFace] = useState(false);

  // Check if card is double-faced
  const isDoubleFaced = card.layout && ['transform', 'modal_dfc', 'double_faced_token'].includes(card.layout);
  const hasBackImage = !!card.back_image_uris;

  // Parse image URIs from JSON
  const imageUris = card.image_uris as { normal?: string; small?: string; large?: string } | null;
  const backImageUris = card.back_image_uris as { normal?: string; small?: string; large?: string } | null;

  const frontImageUrl = imageUris?.normal || imageUris?.large || imageUris?.small;
  const backImageUrl = backImageUris?.normal || backImageUris?.large || backImageUris?.small;

  // Determine which image to display
  const imageUrl = (showBackFace && backImageUrl) ? backImageUrl : frontImageUrl;

  // Determine card dimensions based on size (63:88 ratio for MTG cards)
  const dimensions = {
    small: { width: 120, height: 168 },
    medium: { width: 180, height: 251 },
    large: { width: 240, height: 335 },
  }[size];

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('application/json', JSON.stringify({
      cardId: card.id,
      scryfallId: card.scryfall_id,
      name: card.name,
    }));
    onDragStart?.(card);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onContextMenu?.(card, e);
  };

  const handleFlipClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowBackFace(!showBackFace);
  };

  return (
    <Tooltip
      label={
        <Box>
          <Text size="sm" fw={600}>{card.name}</Text>
          <Text size="xs" c="dimmed">{card.type_line}</Text>
          {card.mana_cost && <Text size="xs">{card.mana_cost}</Text>}
          {isDoubleFaced && <Text size="xs" c="blue">Double-faced card</Text>}
        </Box>
      }
      position="right"
      withArrow
      disabled={size === 'large'}
    >
      <Box
        draggable={draggable}
        onDragStart={handleDragStart}
        onClick={() => onClick?.(card)}
        onContextMenu={handleContextMenu}
        className="mtg-card-container"
        style={{
          position: 'relative',
          width: dimensions.width,
          height: dimensions.height,
          borderRadius: '12px',
          overflow: 'hidden',
          cursor: draggable ? 'grab' : onClick ? 'pointer' : 'default',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
      >
        {imageUrl && !imageError ? (
          <>
            {imageLoading && (
              <Box
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'var(--mantine-color-dark-6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text size="xs" c="dimmed">Loading...</Text>
              </Box>
            )}
            <Image
              src={imageUrl}
              alt={card.name}
              width={dimensions.width}
              height={dimensions.height}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImageError(true);
                setImageLoading(false);
              }}
              unoptimized // Scryfall images are already optimized
            />
          </>
        ) : (
          <Box
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: 'var(--mantine-color-dark-6)',
              border: '2px solid var(--mantine-color-dark-4)',
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: size === 'small' ? '8px' : '12px',
            }}
          >
            <Text
              size={size === 'small' ? 'xs' : 'sm'}
              fw={600}
              ta="center"
              style={{
                color: 'var(--mantine-color-gray-0)',
                wordBreak: 'break-word',
                marginBottom: '4px',
              }}
              lineClamp={2}
            >
              {card.name}
            </Text>

            {card.mana_cost && (
              <Text size="xs" c="dimmed" ta="center">
                {card.mana_cost}
              </Text>
            )}

            <Text
              size="xs"
              c="dimmed"
              ta="center"
              style={{ marginTop: '4px' }}
              lineClamp={size === 'small' ? 1 : 2}
            >
              {card.type_line}
            </Text>

            {card.power && card.toughness && (
              <Text size="xs" c="dimmed" style={{ marginTop: 'auto' }}>
                {card.power}/{card.toughness}
              </Text>
            )}
          </Box>
        )}

        {quantity > 1 && (
          <Badge
            color="blue"
            variant="filled"
            size={size === 'small' ? 'sm' : 'lg'}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              fontWeight: 700,
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
            }}
          >
            {quantity}×
          </Badge>
        )}

        {isDoubleFaced && hasBackImage && (
          <Badge
            color="grape"
            variant="filled"
            size="sm"
            onClick={handleFlipClick}
            style={{
              position: 'absolute',
              bottom: '8px',
              left: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
              userSelect: 'none',
            }}
          >
            {showBackFace ? 'Front' : 'Back'}
          </Badge>
        )}
      </Box>
    </Tooltip>
  );
}
