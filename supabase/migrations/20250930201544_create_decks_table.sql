-- Create decks table for MTG Deck Builder Assistant
-- This table stores user-created decks with metadata and relationships to card pools

CREATE TABLE decks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL CHECK (char_length(name) >= 1 AND char_length(name) <= 255),
    description TEXT,
    format TEXT CHECK (format IN ('limited', 'draft', 'sealed', 'standard', 'modern', 'legacy', 'vintage', 'commander', 'pioneer', 'historic', 'alchemy', 'pauper', 'other')),
    pool_id TEXT, -- Reference to card pool this deck was built from (flexible string reference)
    is_public BOOLEAN NOT NULL DEFAULT false,
    is_archived BOOLEAN NOT NULL DEFAULT false,
    main_deck_count INTEGER NOT NULL DEFAULT 0 CHECK (main_deck_count >= 0),
    sideboard_count INTEGER NOT NULL DEFAULT 0 CHECK (sideboard_count >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX idx_decks_user_id ON decks(user_id);
CREATE INDEX idx_decks_format ON decks(format);
CREATE INDEX idx_decks_pool_id ON decks(pool_id);
CREATE INDEX idx_decks_user_format ON decks(user_id, format);
CREATE INDEX idx_decks_user_pool ON decks(user_id, pool_id);
CREATE INDEX idx_decks_public ON decks(is_public) WHERE is_public = true;
CREATE INDEX idx_decks_archived ON decks(is_archived, user_id);

-- Create updated_at trigger using existing function
CREATE TRIGGER update_decks_updated_at
    BEFORE UPDATE ON decks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE decks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can view their own decks and public decks
CREATE POLICY "Users can view their own decks"
    ON decks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view public decks"
    ON decks FOR SELECT
    USING (is_public = true);

-- Users can insert their own decks
CREATE POLICY "Users can insert their own decks"
    ON decks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own decks
CREATE POLICY "Users can update their own decks"
    ON decks FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own decks
CREATE POLICY "Users can delete their own decks"
    ON decks FOR DELETE
    USING (auth.uid() = user_id);

-- Add helpful comments
COMMENT ON TABLE decks IS 'User-created Magic: The Gathering decks with metadata and pool relationships';
COMMENT ON COLUMN decks.user_id IS 'Reference to the user who owns this deck';
COMMENT ON COLUMN decks.name IS 'User-defined name for the deck (1-255 characters)';
COMMENT ON COLUMN decks.description IS 'Optional deck description or notes';
COMMENT ON COLUMN decks.format IS 'Magic format this deck is designed for (limited, standard, etc.)';
COMMENT ON COLUMN decks.pool_id IS 'Reference to the card pool this deck was built from (flexible string identifier)';
COMMENT ON COLUMN decks.is_public IS 'Whether this deck can be viewed by other users';
COMMENT ON COLUMN decks.is_archived IS 'Whether this deck is archived (hidden from main deck lists)';
COMMENT ON COLUMN decks.main_deck_count IS 'Cached count of cards in the main deck for performance';
COMMENT ON COLUMN decks.sideboard_count IS 'Cached count of cards in the sideboard for performance';
