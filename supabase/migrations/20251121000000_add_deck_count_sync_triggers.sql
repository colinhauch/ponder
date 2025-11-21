-- Migration: Add automatic deck count synchronization
-- Description: Creates triggers to keep main_deck_count and sideboard_count in sync with deck_cards table
-- Date: 2025-11-21

-- Function to synchronize deck card counts
-- This function is called by triggers on deck_cards table to update cached counts in decks table
CREATE OR REPLACE FUNCTION sync_deck_counts()
RETURNS TRIGGER AS $$
BEGIN
  -- For INSERT and UPDATE operations, use NEW row
  IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
    -- Update both main deck and sideboard counts in a single query
    UPDATE decks
    SET
      main_deck_count = (
        SELECT COALESCE(SUM(quantity), 0)
        FROM deck_cards
        WHERE deck_id = NEW.deck_id AND is_sideboard = false
      ),
      sideboard_count = (
        SELECT COALESCE(SUM(quantity), 0)
        FROM deck_cards
        WHERE deck_id = NEW.deck_id AND is_sideboard = true
      )
    WHERE id = NEW.deck_id;

    RETURN NEW;
  END IF;

  -- For DELETE operations, use OLD row
  IF (TG_OP = 'DELETE') THEN
    -- Update both main deck and sideboard counts in a single query
    UPDATE decks
    SET
      main_deck_count = (
        SELECT COALESCE(SUM(quantity), 0)
        FROM deck_cards
        WHERE deck_id = OLD.deck_id AND is_sideboard = false
      ),
      sideboard_count = (
        SELECT COALESCE(SUM(quantity), 0)
        FROM deck_cards
        WHERE deck_id = OLD.deck_id AND is_sideboard = true
      )
    WHERE id = OLD.deck_id;

    RETURN OLD;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for INSERT operations
CREATE TRIGGER sync_deck_counts_on_insert
  AFTER INSERT ON deck_cards
  FOR EACH ROW
  EXECUTE FUNCTION sync_deck_counts();

-- Trigger for UPDATE operations
CREATE TRIGGER sync_deck_counts_on_update
  AFTER UPDATE ON deck_cards
  FOR EACH ROW
  EXECUTE FUNCTION sync_deck_counts();

-- Trigger for DELETE operations
CREATE TRIGGER sync_deck_counts_on_delete
  AFTER DELETE ON deck_cards
  FOR EACH ROW
  EXECUTE FUNCTION sync_deck_counts();

-- Backfill existing deck counts (one-time data fix)
-- This updates all existing decks with correct counts based on current deck_cards data
UPDATE decks d
SET
  main_deck_count = (
    SELECT COALESCE(SUM(quantity), 0)
    FROM deck_cards dc
    WHERE dc.deck_id = d.id AND dc.is_sideboard = false
  ),
  sideboard_count = (
    SELECT COALESCE(SUM(quantity), 0)
    FROM deck_cards dc
    WHERE dc.deck_id = d.id AND dc.is_sideboard = true
  );

-- Add helpful comment for documentation
COMMENT ON FUNCTION sync_deck_counts() IS 'Automatically updates main_deck_count and sideboard_count in decks table when deck_cards are inserted, updated, or deleted. Ensures cached counts stay synchronized with actual card data.';
