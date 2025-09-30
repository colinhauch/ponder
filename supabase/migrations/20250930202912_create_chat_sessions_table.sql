-- Create chat_sessions table for MTG Deck Builder Assistant
-- This table stores AI chat conversation sessions with deck building context

CREATE TABLE chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    deck_id UUID REFERENCES decks(id) ON DELETE SET NULL,
    pool_id TEXT, -- Reference to card pool (flexible string reference)
    name TEXT NOT NULL CHECK (char_length(name) >= 1 AND char_length(name) <= 255),
    messages JSONB NOT NULL DEFAULT '[]'::jsonb,
    context_data JSONB, -- Additional context like deck state, preferences, etc.
    message_count INTEGER NOT NULL DEFAULT 0 CHECK (message_count >= 0),
    token_usage INTEGER NOT NULL DEFAULT 0 CHECK (token_usage >= 0),
    is_archived BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX idx_chat_sessions_deck_id ON chat_sessions(deck_id);
CREATE INDEX idx_chat_sessions_pool_id ON chat_sessions(pool_id);
CREATE INDEX idx_chat_sessions_user_archived ON chat_sessions(user_id, is_archived);
CREATE INDEX idx_chat_sessions_created_at ON chat_sessions(created_at DESC);
CREATE INDEX idx_chat_sessions_updated_at ON chat_sessions(updated_at DESC);

-- Create updated_at trigger using existing function
CREATE TRIGGER update_chat_sessions_updated_at
    BEFORE UPDATE ON chat_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only access their own chat sessions
CREATE POLICY "Users can view their own chat sessions"
    ON chat_sessions FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own chat sessions
CREATE POLICY "Users can insert their own chat sessions"
    ON chat_sessions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own chat sessions
CREATE POLICY "Users can update their own chat sessions"
    ON chat_sessions FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own chat sessions
CREATE POLICY "Users can delete their own chat sessions"
    ON chat_sessions FOR DELETE
    USING (auth.uid() = user_id);

-- Add helpful comments
COMMENT ON TABLE chat_sessions IS 'AI chat conversation sessions with deck building context and message history';
COMMENT ON COLUMN chat_sessions.user_id IS 'Reference to the user who owns this chat session';
COMMENT ON COLUMN chat_sessions.deck_id IS 'Optional reference to the deck being discussed (nullable for general conversations)';
COMMENT ON COLUMN chat_sessions.pool_id IS 'Optional reference to the card pool context for this conversation';
COMMENT ON COLUMN chat_sessions.name IS 'User-defined name for the chat session';
COMMENT ON COLUMN chat_sessions.messages IS 'JSONB array storing the complete conversation history';
COMMENT ON COLUMN chat_sessions.context_data IS 'Additional context data like deck snapshots, user preferences, etc.';
COMMENT ON COLUMN chat_sessions.message_count IS 'Cached count of messages in this session for performance';
COMMENT ON COLUMN chat_sessions.token_usage IS 'Total token usage for this conversation session';
COMMENT ON COLUMN chat_sessions.is_archived IS 'Whether this chat session is archived (hidden from main lists)';