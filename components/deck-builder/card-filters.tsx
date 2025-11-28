'use client';

import { useState } from 'react';
import { Stack, TextInput, Group, Button, Badge, Select, NumberInput, Collapse } from '@mantine/core';
import { IconSearch, IconX, IconFilter } from '@tabler/icons-react';
import type { CardFilters } from './use-card-filters';
import type { MTGColor } from '@/app/types';

interface CardFiltersUIProps {
  filters: CardFilters;
  onSearchChange: (value: string) => void;
  onColorToggle: (color: MTGColor) => void;
  onTypeToggle: (type: string) => void;
  onRarityToggle: (rarity: string) => void;
  onCmcMinChange: (value: number | null) => void;
  onCmcMaxChange: (value: number | null) => void;
  onColorModeChange: (mode: 'exact' | 'includes' | 'at-most') => void;
  onReset: () => void;
  resultsCount: number;
}

const COLORS: { color: MTGColor; label: string; hex: string }[] = [
  { color: 'W', label: 'White', hex: '#F0E68C' },
  { color: 'U', label: 'Blue', hex: '#0E68AB' },
  { color: 'B', label: 'Black', hex: '#150B00' },
  { color: 'R', label: 'Red', hex: '#D3202A' },
  { color: 'G', label: 'Green', hex: '#00733E' },
];

const TYPES = ['Creature', 'Instant', 'Sorcery', 'Enchantment', 'Artifact', 'Planeswalker', 'Land'];

const RARITIES = ['common', 'uncommon', 'rare', 'mythic'];

export function CardFiltersUI({
  filters,
  onSearchChange,
  onColorToggle,
  onTypeToggle,
  onRarityToggle,
  onCmcMinChange,
  onCmcMaxChange,
  onColorModeChange,
  onReset,
  resultsCount,
}: CardFiltersUIProps) {
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  const hasActiveFilters =
    filters.colors.size > 0 ||
    filters.types.size > 0 ||
    filters.rarities.size > 0 ||
    filters.cmcMin !== null ||
    filters.cmcMax !== null;

  return (
    <Stack gap="sm">
      <Group justify="space-between" align="center" wrap="nowrap">
        <TextInput
          placeholder="Search cards..."
          leftSection={<IconSearch size={16} />}
          value={filters.searchText}
          onChange={(e) => onSearchChange(e.currentTarget.value)}
          style={{ flex: 1 }}
          rightSection={
            filters.searchText ? (
              <IconX
                size={16}
                style={{ cursor: 'pointer' }}
                onClick={() => onSearchChange('')}
              />
            ) : null
          }
        />
        <Button
          variant={filtersExpanded ? 'filled' : 'light'}
          size="sm"
          onClick={() => setFiltersExpanded(!filtersExpanded)}
          leftSection={<IconFilter size={16} />}
          style={{ flexShrink: 0 }}
        >
          Filters
          {hasActiveFilters && ` (${
            filters.colors.size +
            filters.types.size +
            filters.rarities.size +
            (filters.cmcMin !== null ? 1 : 0) +
            (filters.cmcMax !== null ? 1 : 0)
          })`}
        </Button>
        <Badge variant="light" size="lg" style={{ flexShrink: 0 }}>
          {resultsCount} cards
        </Badge>
      </Group>

      <Collapse in={filtersExpanded}>
        <Stack gap="sm">
          <Group gap="xs" justify="space-between" align="center">
            <span style={{ fontSize: '14px', fontWeight: 500 }}>Colors</span>
            {hasActiveFilters && (
              <Button
                variant="subtle"
                size="xs"
                onClick={onReset}
                leftSection={<IconX size={14} />}
              >
                Clear All
              </Button>
            )}
          </Group>

          <Group gap="xs">
            {COLORS.map(({ color, hex }) => (
              <Badge
                key={color}
                variant={filters.colors.has(color) ? 'filled' : 'outline'}
                style={{
                  cursor: 'pointer',
                  backgroundColor: filters.colors.has(color) ? hex : 'transparent',
                  borderColor: hex,
                  color: filters.colors.has(color) ? (color === 'W' ? '#000' : '#fff') : hex,
                }}
                onClick={() => onColorToggle(color)}
              >
                {color}
              </Badge>
            ))}
          </Group>

          <div>
            <span style={{ fontSize: '14px', fontWeight: 500 }}>Types</span>
          </div>

          <Group gap="xs">
            {TYPES.map((type) => (
              <Badge
                key={type}
                variant={filters.types.has(type) ? 'filled' : 'outline'}
                style={{ cursor: 'pointer' }}
                onClick={() => onTypeToggle(type)}
              >
                {type}
              </Badge>
            ))}
          </Group>

          <div>
            <span style={{ fontSize: '14px', fontWeight: 500 }}>Rarities</span>
          </div>

          <Group gap="xs">
            {RARITIES.map((rarity) => (
              <Badge
                key={rarity}
                variant={filters.rarities.has(rarity) ? 'filled' : 'outline'}
                style={{ cursor: 'pointer' }}
                onClick={() => onRarityToggle(rarity)}
                color={
                  rarity === 'mythic'
                    ? 'red'
                    : rarity === 'rare'
                    ? 'yellow'
                    : rarity === 'uncommon'
                    ? 'gray'
                    : 'blue'
                }
              >
                {rarity}
              </Badge>
            ))}
          </Group>

          <div>
            <span style={{ fontSize: '14px', fontWeight: 500 }}>Advanced</span>
          </div>

          <Group gap="xs" align="center">
            <Select
              placeholder="Color mode"
              size="xs"
              data={[
                { value: 'includes', label: 'Includes' },
                { value: 'exact', label: 'Exactly' },
                { value: 'at-most', label: 'At most' },
              ]}
              value={filters.colorFilterMode}
              onChange={(value) => onColorModeChange(value as 'exact' | 'includes' | 'at-most')}
              style={{ width: 120 }}
            />
            <NumberInput
              placeholder="Min CMC"
              size="xs"
              min={0}
              max={20}
              value={filters.cmcMin ?? ''}
              onChange={(value) => onCmcMinChange(typeof value === 'number' ? value : null)}
              style={{ width: 100 }}
            />
            <NumberInput
              placeholder="Max CMC"
              size="xs"
              min={0}
              max={20}
              value={filters.cmcMax ?? ''}
              onChange={(value) => onCmcMaxChange(typeof value === 'number' ? value : null)}
              style={{ width: 100 }}
            />
          </Group>
        </Stack>
      </Collapse>
    </Stack>
  );
}
