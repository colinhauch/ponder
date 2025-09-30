-- Create card_pools table for MTG Deck Builder Assistant
-- This table defines named collections of cards that can be used for deck building

CREATE TABLE card_pools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL CHECK (char_length(name) >= 1 AND char_length(name) <= 255),
    description TEXT,
    format TEXT CHECK (format IN ('limited', 'draft', 'sealed', 'standard', 'modern', 'legacy', 'vintage', 'commander', 'pioneer', 'historic', 'alchemy', 'pauper', 'other')),
    is_public BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    card_count INTEGER NOT NULL DEFAULT 0 CHECK (card_count >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    -- Ensure unique pool names per user
    UNIQUE(user_id, name)
);

-- Create indexes for better query performance
CREATE INDEX idx_card_pools_user_id ON card_pools(user_id);
CREATE INDEX idx_card_pools_format ON card_pools(format);
CREATE INDEX idx_card_pools_user_format ON card_pools(user_id, format);
CREATE INDEX idx_card_pools_public ON card_pools(is_public) WHERE is_public = true;
CREATE INDEX idx_card_pools_active ON card_pools(is_active, user_id);

-- Create updated_at trigger using existing function
CREATE TRIGGER update_card_pools_updated_at
    BEFORE UPDATE ON card_pools
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE card_pools ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can view their own card pools and public card pools
CREATE POLICY "Users can view their own card pools"
    ON card_pools FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view public card pools"
    ON card_pools FOR SELECT
    USING (is_public = true);

-- Users can insert their own card pools
CREATE POLICY "Users can insert their own card pools"
    ON card_pools FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own card pools
CREATE POLICY "Users can update their own card pools"
    ON card_pools FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own card pools
CREATE POLICY "Users can delete their own card pools"
    ON card_pools FOR DELETE
    USING (auth.uid() = user_id);

-- Add helpful comments
COMMENT ON TABLE card_pools IS 'Named collections of cards that define available card sets for deck building';
COMMENT ON COLUMN card_pools.user_id IS 'Reference to the user who owns this card pool';
COMMENT ON COLUMN card_pools.name IS 'User-defined name for the card pool (unique per user)';
COMMENT ON COLUMN card_pools.description IS 'Optional description of the card pool purpose or contents';
COMMENT ON COLUMN card_pools.format IS 'Magic format this card pool is intended for';
COMMENT ON COLUMN card_pools.is_public IS 'Whether this card pool can be viewed by other users';
COMMENT ON COLUMN card_pools.is_active IS 'Whether this card pool is currently active (for archiving old pools)';
COMMENT ON COLUMN card_pools.card_count IS 'Cached count of unique cards in this pool for performance';