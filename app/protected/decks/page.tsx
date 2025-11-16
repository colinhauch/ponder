import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Container, Title, Text, Button, Stack } from "@mantine/core";
import Link from "next/link";

export default async function DecksPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
  }

  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        <div>
          <Title order={1}>My Decks</Title>
          <Text c="dimmed" size="sm" mt="xs">
            Manage your Magic: The Gathering decks
          </Text>
        </div>

        <Button component={Link} href="/protected/deck-builder/new" size="md">
          Create New Deck
        </Button>

        {/* Deck list will be implemented here */}
        <Text c="dimmed" ta="center" py="xl">
          Your decks will appear here
        </Text>
      </Stack>
    </Container>
  );
}
