'use client';

import Link from 'next/link';
import { Container, Group, Anchor, Button } from '@mantine/core';
import classes from './header.module.css';

export function Header() {
  return (
    <header className={classes.header}>
      <Container size="xl">
        <Group justify="space-between" py="md">
          <Anchor
            component={Link}
            href="/"
            className={classes.logo}
            underline="never"
          >
            ponder
          </Anchor>

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
