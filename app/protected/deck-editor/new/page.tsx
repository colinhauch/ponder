"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Title,
  Text,
  TextInput,
  Textarea,
  Select,
  Button,
  Stack,
  Alert,
} from "@mantine/core";
import { createClient } from "@/lib/supabase/client";

const FORMATS = [
  { value: "limited", label: "Limited" },
  { value: "draft", label: "Draft" },
  { value: "sealed", label: "Sealed" },
  { value: "standard", label: "Standard" },
  { value: "modern", label: "Modern" },
  { value: "legacy", label: "Legacy" },
  { value: "vintage", label: "Vintage" },
  { value: "commander", label: "Commander" },
  { value: "pioneer", label: "Pioneer" },
  { value: "historic", label: "Historic" },
  { value: "alchemy", label: "Alchemy" },
  { value: "pauper", label: "Pauper" },
  { value: "other", label: "Other" },
];

export default function NewDeckPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [format, setFormat] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Deck name is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      // Get the current user
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        setError("You must be logged in to create a deck");
        setLoading(false);
        return;
      }

      // Create the deck
      const { data: newDeck, error: createError } = await supabase
        .from("decks")
        .insert({
          user_id: user.id,
          name: name.trim(),
          description: description.trim() || null,
          format: format || null,
          main_deck_count: 0,
          sideboard_count: 0,
        })
        .select()
        .single();

      if (createError) {
        console.error("Error creating deck:", createError);
        setError("Failed to create deck. Please try again.");
        setLoading(false);
        return;
      }

      // Redirect to the deck editor
      // Note: router.push() automatically adds basePath, so don't use appPath()
      router.push(`/protected/deck-editor/${newDeck.id}`);
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Container size="sm" py="xl">
      <Stack gap="lg">
        <div>
          <Title order={1}>Create New Deck</Title>
          <Text c="dimmed" size="sm" mt="xs">
            Enter your deck details to get started
          </Text>
        </div>

        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <TextInput
              label="Deck Name"
              placeholder="My Awesome Deck"
              required
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
              disabled={loading}
              maxLength={255}
            />

            <Textarea
              label="Description"
              placeholder="Describe your deck strategy..."
              value={description}
              onChange={(e) => setDescription(e.currentTarget.value)}
              disabled={loading}
              rows={3}
            />

            <Select
              label="Format"
              placeholder="Select a format"
              data={FORMATS}
              value={format}
              onChange={setFormat}
              disabled={loading}
              clearable
            />

            {error && (
              <Alert color="red" title="Error">
                {error}
              </Alert>
            )}

            <Button type="submit" loading={loading} fullWidth size="md">
              Create Deck
            </Button>
          </Stack>
        </form>
      </Stack>
    </Container>
  );
}
