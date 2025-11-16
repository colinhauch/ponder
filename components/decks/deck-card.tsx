import { Card, Text, Group, Badge, Stack, Button } from "@mantine/core";
import Link from "next/link";
import type { Deck } from "@/app/types";

interface DeckCardProps {
  deck: Deck;
}

export function DeckCard({ deck }: DeckCardProps) {
  const formatLabel = deck.format
    ? deck.format.charAt(0).toUpperCase() + deck.format.slice(1)
    : null;

  const totalCards = deck.main_deck_count + deck.sideboard_count;

  const updatedAt = new Date(deck.updated_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        <Link
          href={`/decks/${deck.id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div>
            <Group justify="space-between" mb="xs">
              <Text fw={500} size="lg">
                {deck.name}
              </Text>
              {formatLabel && (
                <Badge color="blue" variant="light">
                  {formatLabel}
                </Badge>
              )}
            </Group>

            {deck.description && (
              <Text size="sm" c="dimmed" lineClamp={2}>
                {deck.description}
              </Text>
            )}
          </div>
        </Link>

        <Group justify="space-between">
          <div>
            <Text size="sm" c="dimmed">
              {totalCards} {totalCards === 1 ? "card" : "cards"}
              {deck.sideboard_count > 0 &&
                ` (${deck.main_deck_count} main, ${deck.sideboard_count} sideboard)`}
            </Text>
            <Text size="xs" c="dimmed">
              Updated {updatedAt}
            </Text>
          </div>

          <Button
            component={Link}
            href={`/protected/deck-editor/${deck.id}`}
            variant="light"
            size="sm"
          >
            Edit Deck
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}
