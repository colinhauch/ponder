'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Burger, Container, Group, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './header-simple.module.css';

const links = [
  { link: '/', label: 'Home' },
  { link: '/about', label: 'About' },
];

export function HeaderSimple() {
  const [opened, { toggle }] = useDisclosure(false);
  const [active, setActive] = useState(links[0].link);

  const items = links.map((link) => (
    <Link
      key={link.label}
      href={link.link}
      className={classes.link}
      data-active={active === link.link || undefined}
      onClick={() => setActive(link.link)}
    >
      {link.label}
    </Link>
  ));

  return (
    <header className={classes.header}>
      <Container size="md" className={classes.inner}>
        <Link href="/" className={classes.logo}>
          <Text size="xl" fw={700} variant="gradient" gradient={{ from: 'violet', to: 'cyan', deg: 45 }}>
            Ponder
          </Text>
        </Link>

        <Group gap={5} visibleFrom="xs">
          {items}
        </Group>

        <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
      </Container>
    </header>
  );
}
