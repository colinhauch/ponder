-- Create collections table for MTG Deck Builder Assistant
-- This table tracks user card collections with quantities and pool organization

CREATE TABLE collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    card_id UUID REFERENCES cards(id) ON DELETE CASCADE NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity >= 0),
    pool_name TEXT NOT NULL DEFAULT 'main',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    -- Ensure one entry per user/card/pool combination
    UNIQUE(user_id, card_id, pool_name)
);

-- Create indexes for better query performance
CREATE INDEX idx_collections_user_id ON collections(user_id);
CREATE INDEX idx_collections_card_id ON collections(card_id);
CREATE INDEX idx_collections_pool_name ON collections(pool_name);
CREATE INDEX idx_collections_user_pool ON collections(user_id, pool_name);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_collections_updated_at
    BEFORE UPDATE ON collections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own collections
CREATE POLICY "Users can view their own collections"
    ON collections FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own collections
CREATE POLICY "Users can insert their own collections"
    ON collections FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own collections
CREATE POLICY "Users can update their own collections"
    ON collections FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own collections
CREATE POLICY "Users can delete their own collections"
    ON collections FOR DELETE
    USING (auth.uid() = user_id);

-- Add helpful comments
COMMENT ON TABLE collections IS 'User card collections with quantities organized by pools';
COMMENT ON COLUMN collections.user_id IS 'Reference to the user who owns this collection entry';
COMMENT ON COLUMN collections.card_id IS 'Reference to the card in this collection';
COMMENT ON COLUMN collections.quantity IS 'Number of this card owned by the user in this pool';
COMMENT ON COLUMN collections.pool_name IS 'Pool name for organizing collections (e.g., main, draft-pool-1, wishlist)';