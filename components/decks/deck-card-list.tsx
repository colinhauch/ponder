import { SimpleGrid, Title, Text, Stack, Divider } from "@mantine/core";
import { CardImage } from "./card-image";
import type { DeckCard, Card } from "@/app/types";

interface DeckCardListProps {
  title: string;
  deckCards: (DeckCard & { cards: Card })[];
  emptyMessage?: string;
}

export function DeckCardList({
  title,
  deckCards,
  emptyMessage = "No cards in this section",
}: DeckCardListProps) {
  const totalCards = deckCards.reduce(
    (sum, deckCard) => sum + deckCard.quantity,
    0
  );

  return (
    <Stack gap="md">
      <div>
        <Title order={3}>
          {title}
          {totalCards > 0 && (
            <Text component="span" c="dimmed" fw={400} size="lg" ml="xs">
              ({totalCards} {totalCards === 1 ? "card" : "cards"})
            </Text>
          )}
        </Title>
        <Divider mt="xs" />
      </div>

      {deckCards.length === 0 ? (
        <Text c="dimmed" ta="center" py="xl">
          {emptyMessage}
        </Text>
      ) : (
        <SimpleGrid
          cols={{ base: 2, xs: 3, sm: 4, md: 5, lg: 6 }}
          spacing="md"
        >
          {deckCards.map((deckCard) => (
            <CardImage
              key={deckCard.id}
              card={deckCard.cards}
              quantity={deckCard.quantity}
            />
          ))}
        </SimpleGrid>
      )}
    </Stack>
  );
}
