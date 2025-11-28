import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Container, Title, Text, Stack, Button, SimpleGrid, Card } from "@mantine/core";
import { IconCards, IconSparkles, IconBook } from "@tabler/icons-react";
import Link from "next/link";
import { appPath } from "@/lib/paths";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect(appPath("/auth/login"));
  }

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        <div>
          <Title order={1}>Welcome to Ponder</Title>
          <Text c="dimmed" size="lg" mt="xs">
            Your Magic: The Gathering deck building companion
          </Text>
        </div>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack gap="md">
              <IconCards size={32} stroke={1.5} />
              <Title order={3}>My Decks</Title>
              <Text size="sm" c="dimmed">
                View and manage all your Magic decks in one place
              </Text>
              <Button component={Link} href="/protected/decks" variant="light" fullWidth>
                View Decks
              </Button>
            </Stack>
          </Card>

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack gap="md">
              <IconSparkles size={32} stroke={1.5} />
              <Title order={3}>Deck Builder</Title>
              <Text size="sm" c="dimmed">
                Create new decks with AI-powered suggestions
              </Text>
              <Button component={Link} href="/protected/deck-editor/new" variant="light" fullWidth>
                Build Deck
              </Button>
            </Stack>
          </Card>

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack gap="md">
              <IconBook size={32} stroke={1.5} />
              <Title order={3}>Collections</Title>
              <Text size="sm" c="dimmed">
                Manage your card collection and pools
              </Text>
              <Button component={Link} href="/protected/collections" variant="light" fullWidth disabled>
                Coming Soon
              </Button>
            </Stack>
          </Card>
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
