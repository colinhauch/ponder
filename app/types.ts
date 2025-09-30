import type { Database } from "../lib/types/database"

export type Card = Database["public"]["Tables"]["cards"]["Row"];

// Magic: The Gathering color enum based on Scryfall API
export type MTGColor = Database["public"]["Enums"]["mtg_color"];

// Helper type for color arrays (how colors are typically stored)
export type MTGColors = MTGColor[];

