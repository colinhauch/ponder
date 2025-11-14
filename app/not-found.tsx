import { Container, Title, Text, Button, Paper } from '@mantine/core';
import Link from 'next/link';

export const runtime = 'edge';

export default function NotFound() {
  return (
    <Container size="sm" style={{ paddingTop: '5rem', paddingBottom: '5rem' }}>
      <Paper shadow="md" p="xl" radius="md" withBorder>
        <Title order={1} style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          404
        </Title>
        <Title order={2} style={{ marginBottom: '1rem' }}>
          Page Not Found
        </Title>
        <Text c="dimmed" size="lg" style={{ marginBottom: '2rem' }}>
          The page you are looking for does not exist or has been moved.
        </Text>
        <Button component={Link} href="/" size="md">
          Return Home
        </Button>
      </Paper>
    </Container>
  );
}
