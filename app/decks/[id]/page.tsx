import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  Container,
  Title,
  Text,
  Button,
  Stack,
  Group,
  Badge,
  Alert,
} from "@mantine/core";
import Link from "next/link";
import { DeckCardList } from "@/components/decks/deck-card-list";
import type { DeckWithCards } from "@/app/types";

export default async function DeckViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Get current user (may be null for public viewing)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch deck with all cards
  const { data: deck, error: deckError } = await supabase
    .from("decks")
    .select(
      `
      *,
      deck_cards (
        id,
        quantity,
        is_sideboard,
        cards (*)
      )
    `
    )
    .eq("id", id)
    .single();

  // Handle errors and not found
  if (deckError || !deck) {
    notFound();
  }

  // Type assertion for the nested query result
  const deckWithCards = deck as unknown as DeckWithCards;

  // Check access permissions
  const isOwner = user?.id === deckWithCards.user_id;
  const isPublic = deckWithCards.is_public;

  // If deck is not public and user is not the owner, show not found
  if (!isPublic && !isOwner) {
    notFound();
  }

  // Separate main deck and sideboard cards
  const mainDeckCards = deckWithCards.deck_cards.filter(
    (dc) => !dc.is_sideboard
  );
  const sideboardCards = deckWithCards.deck_cards.filter(
    (dc) => dc.is_sideboard
  );

  const formatLabel = deckWithCards.format
    ? deckWithCards.format.charAt(0).toUpperCase() +
      deckWithCards.format.slice(1)
    : null;

  const createdAt = new Date(deckWithCards.created_at).toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* Deck Header */}
        <div>
          <Group justify="space-between" mb="md">
            <div>
              <Group gap="md" mb="xs">
                <Title order={1}>{deckWithCards.name}</Title>
                {formatLabel && (
                  <Badge color="blue" variant="light" size="lg">
                    {formatLabel}
                  </Badge>
                )}
                {!isPublic && isOwner && (
                  <Badge color="gray" variant="light" size="lg">
                    Private
                  </Badge>
                )}
                {isPublic && (
                  <Badge color="green" variant="light" size="lg">
                    Public
                  </Badge>
                )}
              </Group>

              {deckWithCards.description && (
                <Text c="dimmed" size="md" mb="xs">
                  {deckWithCards.description}
                </Text>
              )}

              <Text size="sm" c="dimmed">
                Created {createdAt} • {deckWithCards.main_deck_count} main deck
                cards • {deckWithCards.sideboard_count} sideboard cards
              </Text>
            </div>

            {isOwner && (
              <Button
                component={Link}
                href={`/protected/deck-editor/${deckWithCards.id}`}
                size="md"
              >
                Edit Deck
              </Button>
            )}
          </Group>
        </div>

        {/* Main Deck Section */}
        <DeckCardList
          title="Main Deck"
          deckCards={mainDeckCards}
          emptyMessage="No cards in the main deck yet"
        />

        {/* Sideboard Section */}
        {(sideboardCards.length > 0 || isOwner) && (
          <DeckCardList
            title="Sideboard"
            deckCards={sideboardCards}
            emptyMessage="No sideboard cards yet"
          />
        )}

        {/* Empty deck message */}
        {mainDeckCards.length === 0 && sideboardCards.length === 0 && (
          <Alert color="blue" title="Empty Deck">
            This deck doesn&apos;t have any cards yet.
            {isOwner && " Click 'Edit Deck' to start building!"}
          </Alert>
        )}
      </Stack>
    </Container>
  );
}
