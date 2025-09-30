-- Create deck_cards table for MTG Deck Builder Assistant
-- This table stores the actual card contents of decks with quantities and sideboard tracking

CREATE TABLE deck_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deck_id UUID REFERENCES decks(id) ON DELETE CASCADE NOT NULL,
    card_id UUID REFERENCES cards(id) ON DELETE CASCADE NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity >= 1 AND quantity <= 4),
    is_sideboard BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    -- Ensure one entry per deck/card/sideboard combination
    -- This allows the same card to appear in both main deck and sideboard with different quantities
    UNIQUE(deck_id, card_id, is_sideboard)
);

-- Create indexes for better query performance
CREATE INDEX idx_deck_cards_deck_id ON deck_cards(deck_id);
CREATE INDEX idx_deck_cards_card_id ON deck_cards(card_id);
CREATE INDEX idx_deck_cards_sideboard ON deck_cards(is_sideboard);
CREATE INDEX idx_deck_cards_deck_sideboard ON deck_cards(deck_id, is_sideboard);

-- Create updated_at trigger using existing function
CREATE TRIGGER update_deck_cards_updated_at
    BEFORE UPDATE ON deck_cards
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE deck_cards ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can view deck cards for their own decks and public decks
CREATE POLICY "Users can view their own deck cards"
    ON deck_cards FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM decks 
            WHERE decks.id = deck_cards.deck_id 
            AND decks.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can view public deck cards"
    ON deck_cards FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM decks 
            WHERE decks.id = deck_cards.deck_id 
            AND decks.is_public = true
        )
    );

-- Users can insert deck cards for their own decks
CREATE POLICY "Users can insert their own deck cards"
    ON deck_cards FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM decks 
            WHERE decks.id = deck_cards.deck_id 
            AND decks.user_id = auth.uid()
        )
    );

-- Users can update deck cards for their own decks
CREATE POLICY "Users can update their own deck cards"
    ON deck_cards FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM decks 
            WHERE decks.id = deck_cards.deck_id 
            AND decks.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM decks 
            WHERE decks.id = deck_cards.deck_id 
            AND decks.user_id = auth.uid()
        )
    );

-- Users can delete deck cards for their own decks
CREATE POLICY "Users can delete their own deck cards"
    ON deck_cards FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM decks 
            WHERE decks.id = deck_cards.deck_id 
            AND decks.user_id = auth.uid()
        )
    );

-- Add helpful comments
COMMENT ON TABLE deck_cards IS 'Card contents of user decks with quantities and sideboard tracking';
COMMENT ON COLUMN deck_cards.deck_id IS 'Reference to the deck containing this card';
COMMENT ON COLUMN deck_cards.card_id IS 'Reference to the specific card in this deck';
COMMENT ON COLUMN deck_cards.quantity IS 'Number of copies of this card in the deck (1-4 for most formats)';
COMMENT ON COLUMN deck_cards.is_sideboard IS 'Whether this card entry is in the sideboard (false = main deck)';
