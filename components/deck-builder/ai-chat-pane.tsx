'use client';

import { Paper, Title, Stack, Skeleton, Textarea, Button } from '@mantine/core';
import { IconSend } from '@tabler/icons-react';

export function AiChatPane() {
  return (
    <Paper shadow="sm" p="md" withBorder h="100%">
      <Stack gap="md" h="100%">
        <Title order={3}>AI Assistant</Title>

        <Stack gap="sm" style={{ flex: 1, overflow: 'auto' }}>
          <Skeleton height={80} radius="md" />
          <Skeleton height={60} radius="md" />
          <Skeleton height={100} radius="md" />
          <Skeleton height={70} radius="md" />
        </Stack>

        <Stack gap="xs">
          <Textarea
            placeholder="Ask the AI for deck suggestions..."
            minRows={3}
          />
          <Button rightSection={<IconSend size={16} />}>
            Send
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
