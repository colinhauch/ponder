-- Migration: Add support for double-faced cards (DFC)
-- Adds minimal storage for layout type and back face image URIs

-- Add layout column to identify card layout types
-- Values: 'normal', 'transform', 'modal_dfc', 'meld', 'double_faced_token', etc.
ALTER TABLE public.cards
ADD COLUMN layout TEXT DEFAULT 'normal';

-- Add back face image URIs for double-faced cards
-- Stores full image_uris object (small, normal, large, png, art_crop, border_crop)
ALTER TABLE public.cards
ADD COLUMN back_image_uris JSONB;

-- Create index on layout for filtering queries
CREATE INDEX IF NOT EXISTS idx_cards_layout ON public.cards(layout);

-- Add helpful comments
COMMENT ON COLUMN public.cards.layout IS 'Card layout type from Scryfall (normal, transform, modal_dfc, meld, etc.)';
COMMENT ON COLUMN public.cards.back_image_uris IS 'Back face image URIs for double-faced cards (same structure as image_uris)';
