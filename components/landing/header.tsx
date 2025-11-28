import Link from 'next/link';
import { Container, Group, Anchor, Button } from '@mantine/core';
import { createClient } from '@/lib/supabase/server';
import classes from './header.module.css';

export async function Header() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const isAuthenticated = !!data.user;

  return (
    <header className={classes.header}>
      <Container size="xl">
        <Group justify="space-between" py="md">
          <Group gap="md">
            <Anchor
              component={Link}
              href="/"
              className={classes.logo}
              underline="never"
            >
              ponder
            </Anchor>
            <Button
              component={Link}
              href={isAuthenticated ? '/protected/decks' : '/auth/login?next=/protected/decks'}
              variant="default"
            >
              Decks
            </Button>
          </Group>

          <Group gap="sm">
            <Button
              component={Link}
              href="/auth/login"
              variant="subtle"
              color="violet"
            >
              Sign in
            </Button>
            <Button
              component={Link}
              href="/auth/sign-up"
              variant="gradient"
              gradient={{ from: 'violet', to: 'cyan', deg: 45 }}
            >
              Get started
            </Button>
          </Group>
        </Group>
      </Container>
    </header>
  );
}
