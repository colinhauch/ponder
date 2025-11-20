'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { CurrentDeckPane } from './current-deck-pane';
import { CardPoolPane } from './card-pool-pane';
import { AiChatPane } from './ai-chat-pane';
import { useDeckState } from './use-deck-state';
import { DeckBuilderProvider, useDeckBuilder } from './deck-builder-context';
import type { Card } from '@/app/types';

function ResizableGridContent() {
  const params = useParams();
  const deckId = params?.id as string;

  const [leftWidth, setLeftWidth] = useState(50);
  const [topHeight, setTopHeight] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingHorizontal = useRef(false);
  const isDraggingVertical = useRef(false);

  // Deck state management
  const { mainDeck, sideboard, loading, addCard, removeCard } = useDeckState({ deckId });
  const { draggedCard, setDraggedCard, dragSource, setDragSource } = useDeckBuilder();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingHorizontal.current && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
        setLeftWidth(Math.min(Math.max(newWidth, 20), 80));
      }

      if (isDraggingVertical.current && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const newHeight = ((e.clientY - containerRect.top) / containerRect.height) * 100;
        setTopHeight(Math.min(Math.max(newHeight, 20), 80));
      }
    };

    const handleMouseUp = () => {
      isDraggingHorizontal.current = false;
      isDraggingVertical.current = false;
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleHorizontalDragStart = () => {
    isDraggingHorizontal.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const handleVerticalDragStart = () => {
    isDraggingVertical.current = true;
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';
  };

  // Handle card drag from pool
  const handleCardDragStart = (card: Card) => {
    setDraggedCard(card);
    setDragSource('pool');
  };

  // Handle card drag from deck
  const handleDeckCardDragStart = (card: Card) => {
    setDraggedCard(card);
    setDragSource('deck');
  };

  // Handle card click
  const handleCardClick = (card: Card) => {
    console.log('Clicked card:', card.name);
    // TODO: Open card detail modal
  };

  // Handle card context menu
  const handleCardContextMenu = (card: Card) => {
    console.log('Context menu for card:', card.name);
    // TODO: Show context menu
  };

  // Handle drop on deck pane
  const handleDeckDrop = async () => {
    if (draggedCard && dragSource === 'pool') {
      await addCard(draggedCard, false, 1);
      setDraggedCard(null);
      setDragSource(null);
    }
  };

  // Handle drag end (removal when dragged outside deck pane)
  const handleDragEnd = async () => {
    // If we were dragging from deck and it wasn't dropped on the deck pane, remove it
    if (draggedCard && dragSource === 'deck') {
      await removeCard(draggedCard.id, false, 1);
    }
    setDraggedCard(null);
    setDragSource(null);
  };

  return (
    <div
      ref={containerRef}
      style={{ display: 'flex', height: '100%', width: '100%', overflow: 'hidden' }}
      onDragEnd={handleDragEnd}
    >
      {/* Left Column */}
      <div style={{ width: `${leftWidth}%`, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
        {/* Top Pane - Current Deck */}
        <div style={{
          height: `${topHeight}%`,
          padding: 'var(--mantine-spacing-md)',
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}>
          <CurrentDeckPane
            mainDeck={mainDeck}
            sideboard={sideboard}
            loading={loading}
            onCardClick={handleCardClick}
            onCardContextMenu={handleCardContextMenu}
            onCardDragStart={handleDeckCardDragStart}
            onDrop={handleDeckDrop}
          />
        </div>

        {/* Vertical Resizer */}
        <div
          onMouseDown={handleVerticalDragStart}
          style={{
            height: '4px',
            cursor: 'row-resize',
            backgroundColor: 'var(--mantine-color-dark-4)',
            position: 'relative',
            zIndex: 10,
            flexShrink: 0,
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--mantine-color-violet-6)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--mantine-color-dark-4)'}
        />

        {/* Bottom Pane - Card Pool */}
        <div style={{
          height: `calc(${100 - topHeight}% - 4px)`,
          padding: 'var(--mantine-spacing-md)',
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}>
          <CardPoolPane
            onCardDragStart={handleCardDragStart}
            onCardClick={handleCardClick}
            onCardContextMenu={handleCardContextMenu}
          />
        </div>
      </div>

      {/* Horizontal Resizer */}
      <div
        onMouseDown={handleHorizontalDragStart}
        style={{
          width: '4px',
          cursor: 'col-resize',
          backgroundColor: 'var(--mantine-color-dark-4)',
          position: 'relative',
          zIndex: 10,
          flexShrink: 0,
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--mantine-color-violet-6)'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--mantine-color-dark-4)'}
      />

      {/* Right Column - AI Chat */}
      <div style={{
        width: `calc(${100 - leftWidth}% - 4px)`,
        padding: 'var(--mantine-spacing-md)',
        overflow: 'hidden',
        boxSizing: 'border-box'
      }}>
        <AiChatPane />
      </div>
    </div>
  );
}

export function ResizableGrid() {
  return (
    <DeckBuilderProvider>
      <ResizableGridContent />
    </DeckBuilderProvider>
  );
}
