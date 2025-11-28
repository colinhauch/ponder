-- Create cards table for MTG card data imported from Scryfall API
-- This table stores shared card data referenced by all users' collections and decks

-- Create updated_at trigger function (used by all tables with updated_at column)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TABLE IF NOT EXISTS public.cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scryfall_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  mana_cost TEXT,
  cmc NUMERIC NOT NULL,
  type_line TEXT NOT NULL,
  colors TEXT[],
  color_identity TEXT[],
  power TEXT,
  toughness TEXT,
  rarity TEXT NOT NULL,
  set_code TEXT NOT NULL,
  collector_number TEXT,
  keywords TEXT NOT NULL DEFAULT '',
  image_uris JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_cards_scryfall_id ON public.cards(scryfall_id);
CREATE INDEX IF NOT EXISTS idx_cards_name ON public.cards(name);
CREATE INDEX IF NOT EXISTS idx_cards_set_code ON public.cards(set_code);
CREATE INDEX IF NOT EXISTS idx_cards_colors ON public.cards USING GIN(colors);
CREATE INDEX IF NOT EXISTS idx_cards_type_line ON public.cards(type_line);

-- Add trigger for updated_at timestamp
CREATE TRIGGER update_cards_updated_at
  BEFORE UPDATE ON public.cards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add helpful comments
COMMENT ON TABLE public.cards IS 'MTG card data imported from Scryfall API. Shared across all users.';
COMMENT ON COLUMN public.cards.scryfall_id IS 'Unique identifier from Scryfall API';
COMMENT ON COLUMN public.cards.cmc IS 'Converted Mana Cost (numeric value)';
COMMENT ON COLUMN public.cards.colors IS 'Card colors array (W, U, B, R, G)';
COMMENT ON COLUMN public.cards.color_identity IS 'Color identity for Commander format';
COMMENT ON COLUMN public.cards.keywords IS 'Comma-separated keywords (Flying, Trample, etc.)';
COMMENT ON COLUMN public.cards.image_uris IS 'JSON object containing Scryfall image URLs';
