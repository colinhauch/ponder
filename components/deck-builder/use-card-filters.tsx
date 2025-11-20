'use client';

import { useState, useMemo } from 'react';
import type { Card, MTGColor } from '@/app/types';

export interface CardFilters {
  searchText: string;
  colors: Set<MTGColor>;
  types: Set<string>;
  rarities: Set<string>;
  cmcMin: number | null;
  cmcMax: number | null;
  colorFilterMode: 'exact' | 'includes' | 'at-most';
}

export function useCardFilters(cards: Card[]) {
  const [filters, setFilters] = useState<CardFilters>({
    searchText: '',
    colors: new Set(),
    types: new Set(),
    rarities: new Set(),
    cmcMin: null,
    cmcMax: null,
    colorFilterMode: 'includes',
  });

  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      // Text search
      if (filters.searchText) {
        const searchLower = filters.searchText.toLowerCase();
        const matchesName = card.name.toLowerCase().includes(searchLower);
        const matchesType = card.type_line.toLowerCase().includes(searchLower);
        if (!matchesName && !matchesType) return false;
      }

      // Color filter
      if (filters.colors.size > 0) {
        const cardColors = new Set(card.colors || []);
        const filterColors = filters.colors;

        if (filters.colorFilterMode === 'exact') {
          // Card must have exactly these colors
          if (cardColors.size !== filterColors.size) return false;
          for (const color of filterColors) {
            if (!cardColors.has(color)) return false;
          }
        } else if (filters.colorFilterMode === 'includes') {
          // Card must include at least one of these colors
          let hasMatch = false;
          for (const color of filterColors) {
            if (cardColors.has(color)) {
              hasMatch = true;
              break;
            }
          }
          if (!hasMatch) return false;
        } else if (filters.colorFilterMode === 'at-most') {
          // Card must only have colors from this set (subset)
          for (const color of cardColors) {
            if (!filterColors.has(color as MTGColor)) return false;
          }
        }
      }

      // Type filter (checks if type_line contains any of the selected types)
      if (filters.types.size > 0) {
        const typeLine = card.type_line.toLowerCase();
        let hasMatch = false;
        for (const type of filters.types) {
          if (typeLine.includes(type.toLowerCase())) {
            hasMatch = true;
            break;
          }
        }
        if (!hasMatch) return false;
      }

      // Rarity filter
      if (filters.rarities.size > 0) {
        if (!filters.rarities.has(card.rarity)) return false;
      }

      // CMC filter
      if (filters.cmcMin !== null && card.cmc < filters.cmcMin) return false;
      if (filters.cmcMax !== null && card.cmc > filters.cmcMax) return false;

      return true;
    });
  }, [cards, filters]);

  const updateFilter = <K extends keyof CardFilters>(
    key: K,
    value: CardFilters[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      searchText: '',
      colors: new Set(),
      types: new Set(),
      rarities: new Set(),
      cmcMin: null,
      cmcMax: null,
      colorFilterMode: 'includes',
    });
  };

  const toggleColor = (color: MTGColor) => {
    setFilters((prev) => {
      const newColors = new Set(prev.colors);
      if (newColors.has(color)) {
        newColors.delete(color);
      } else {
        newColors.add(color);
      }
      return { ...prev, colors: newColors };
    });
  };

  const toggleType = (type: string) => {
    setFilters((prev) => {
      const newTypes = new Set(prev.types);
      if (newTypes.has(type)) {
        newTypes.delete(type);
      } else {
        newTypes.add(type);
      }
      return { ...prev, types: newTypes };
    });
  };

  const toggleRarity = (rarity: string) => {
    setFilters((prev) => {
      const newRarities = new Set(prev.rarities);
      if (newRarities.has(rarity)) {
        newRarities.delete(rarity);
      } else {
        newRarities.add(rarity);
      }
      return { ...prev, rarities: newRarities };
    });
  };

  return {
    filters,
    filteredCards,
    updateFilter,
    resetFilters,
    toggleColor,
    toggleType,
    toggleRarity,
  };
}
