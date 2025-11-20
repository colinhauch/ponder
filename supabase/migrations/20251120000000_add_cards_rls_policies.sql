-- Migration: Add RLS policies for cards table
-- Description: Allow all authenticated users to read cards, but only service role can write
-- Date: 2025-11-20

-- Enable RLS on cards table if not already enabled
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (in case we're re-running this)
DROP POLICY IF EXISTS "Anyone can view cards" ON public.cards;
DROP POLICY IF EXISTS "Service role can insert cards" ON public.cards;
DROP POLICY IF EXISTS "Service role can update cards" ON public.cards;
DROP POLICY IF EXISTS "Service role can delete cards" ON public.cards;

-- Policy: Allow all users (even unauthenticated) to read cards
-- This is a shared resource - all users should be able to see all cards
CREATE POLICY "Anyone can view cards"
  ON public.cards
  FOR SELECT
  USING (true);

-- Policy: Only service role can insert cards
-- This prevents users from adding fake cards to the database
CREATE POLICY "Service role can insert cards"
  ON public.cards
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- Policy: Only service role can update cards
CREATE POLICY "Service role can update cards"
  ON public.cards
  FOR UPDATE
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Policy: Only service role can delete cards
CREATE POLICY "Service role can delete cards"
  ON public.cards
  FOR DELETE
  USING (auth.role() = 'service_role');

-- Add comment for documentation
COMMENT ON TABLE public.cards IS 'Shared card data from Scryfall. Read access for all users, write access only for service role (import scripts).';
