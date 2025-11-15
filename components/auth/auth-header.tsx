'use client';

import Link from 'next/link';
import { Container, Group, Anchor } from '@mantine/core';
import classes from './auth-header.module.css';

export function AuthHeader() {
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
        </Group>
      </Container>
    </header>
  );
}
