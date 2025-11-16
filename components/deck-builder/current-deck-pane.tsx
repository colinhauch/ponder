'use client';

import { Paper, Title, Stack, Skeleton } from '@mantine/core';

export function CurrentDeckPane() {
  return (
    <Paper shadow="sm" p="md" withBorder h="100%">
      <Stack gap="md">
        <Title order={3}>Current Deck</Title>
        <Skeleton height={40} radius="md" />
        <Skeleton height={40} radius="md" />
        <Skeleton height={40} radius="md" />
        <Skeleton height={40} radius="md" />
        <Skeleton height={40} radius="md" />
      </Stack>
    </Paper>
  );
}
