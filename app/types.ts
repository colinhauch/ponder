import type { Database } from "../lib/types/database"

export type Card = Database["public"]["Tables"]["cards"]["Row"];

// TODO: Add MTG color enums to database schema
// Magic: The Gathering color enum based on Scryfall API
// Since we store colors as string arrays, let's define the color type manually for now
export type MTGColor = "W" | "U" | "B" | "R" | "G";

// Helper type for color arrays (how colors are typically stored)
export type MTGColors = MTGColor[];

