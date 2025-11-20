'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { Card } from '@/app/types';

interface DeckBuilderContextType {
  draggedCard: Card | null;
  setDraggedCard: (card: Card | null) => void;
  cardPool: Map<string, Card>;
  setCardPool: (pool: Map<string, Card>) => void;
}

const DeckBuilderContext = createContext<DeckBuilderContextType | undefined>(undefined);

export function DeckBuilderProvider({ children }: { children: ReactNode }) {
  const [draggedCard, setDraggedCard] = useState<Card | null>(null);
  const [cardPool, setCardPool] = useState<Map<string, Card>>(new Map());

  return (
    <DeckBuilderContext.Provider
      value={{
        draggedCard,
        setDraggedCard,
        cardPool,
        setCardPool,
      }}
    >
      {children}
    </DeckBuilderContext.Provider>
  );
}

export function useDeckBuilder() {
  const context = useContext(DeckBuilderContext);
  if (!context) {
    throw new Error('useDeckBuilder must be used within DeckBuilderProvider');
  }
  return context;
}
