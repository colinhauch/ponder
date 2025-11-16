'use client';

import { useState, useRef, useEffect } from 'react';
import { CurrentDeckPane } from './current-deck-pane';
import { CardPoolPane } from './card-pool-pane';
import { AiChatPane } from './ai-chat-pane';

export function ResizableGrid() {
  const [leftWidth, setLeftWidth] = useState(50); // percentage
  const [topHeight, setTopHeight] = useState(50); // percentage for left column split
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingHorizontal = useRef(false);
  const isDraggingVertical = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingHorizontal.current && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
        setLeftWidth(Math.min(Math.max(newWidth, 20), 80)); // Limit between 20-80%
      }

      if (isDraggingVertical.current && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const newHeight = ((e.clientY - containerRect.top) / containerRect.height) * 100;
        setTopHeight(Math.min(Math.max(newHeight, 20), 80)); // Limit between 20-80%
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

  return (
    <div ref={containerRef} style={{ display: 'flex', height: '100%', width: '100%' }}>
      {/* Left Column */}
      <div style={{ width: `${leftWidth}%`, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {/* Top Pane - Current Deck */}
        <div style={{ height: `${topHeight}%`, padding: 'var(--mantine-spacing-md)' }}>
          <CurrentDeckPane />
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
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--mantine-color-violet-6)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--mantine-color-dark-4)'}
        />

        {/* Bottom Pane - Card Pool */}
        <div style={{ height: `${100 - topHeight}%`, padding: 'var(--mantine-spacing-md)' }}>
          <CardPoolPane />
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
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--mantine-color-violet-6)'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--mantine-color-dark-4)'}
      />

      {/* Right Column - AI Chat */}
      <div style={{ width: `${100 - leftWidth}%`, padding: 'var(--mantine-spacing-md)' }}>
        <AiChatPane />
      </div>
    </div>
  );
}
