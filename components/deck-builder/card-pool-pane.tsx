'use client';

import { Paper, Title, Stack, Skeleton, TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

export function CardPoolPane() {
  return (
    <Paper shadow="sm" p="md" withBorder h="100%">
      <Stack gap="md">
        <Title order={3}>Card Pool</Title>
        <TextInput
          placeholder="Search cards..."
          leftSection={<IconSearch size={16} />}
        />
        <Skeleton height={60} radius="md" />
        <Skeleton height={60} radius="md" />
        <Skeleton height={60} radius="md" />
        <Skeleton height={60} radius="md" />
      </Stack>
    </Paper>
  );
}
