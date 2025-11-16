import { SimpleGrid, Text, Stack } from "@mantine/core";
import { DeckCard } from "./deck-card";
import type { Deck } from "@/app/types";

interface DeckListProps {
  decks: Deck[];
}

export function DeckList({ decks }: DeckListProps) {
  if (decks.length === 0) {
    return (
      <Stack gap="md" align="center" py="xl">
        <Text c="dimmed" ta="center" size="lg">
          No decks yet
        </Text>
        <Text c="dimmed" ta="center" size="sm">
          Create your first deck to get started
        </Text>
      </Stack>
    );
  }

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
      {decks.map((deck) => (
        <DeckCard key={deck.id} deck={deck} />
      ))}
    </SimpleGrid>
  );
}
