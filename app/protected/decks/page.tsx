import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Container, Title, Text, Button, Stack, Alert } from "@mantine/core";
import Link from "next/link";
import { DeckList } from "@/components/decks/deck-list";

export default async function DecksPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/auth/login");
  }

  // Fetch user's decks from Supabase
  const { data: decks, error: decksError } = await supabase
    .from("decks")
    .select("*")
    .eq("is_archived", false)
    .order("updated_at", { ascending: false });

  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        <div>
          <Title order={1}>My Decks</Title>
          <Text c="dimmed" size="sm" mt="xs">
            Manage your Magic: The Gathering decks
          </Text>
        </div>

        <Button component={Link} href="/protected/deck-editor/new" size="md">
          Create New Deck
        </Button>

        {decksError ? (
          <Alert color="red" title="Error loading decks">
            Failed to load your decks. Please try again later.
          </Alert>
        ) : (
          <DeckList decks={decks || []} />
        )}
      </Stack>
    </Container>
  );
}
