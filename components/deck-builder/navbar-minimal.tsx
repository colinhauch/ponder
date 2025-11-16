'use client';

import { useState } from 'react';
import {
  IconCards,
  IconList,
  IconHome2,
  IconLogout,
  IconSettings,
} from '@tabler/icons-react';
import { Center, Stack, Tooltip, UnstyledButton } from '@mantine/core';
import classes from './navbar-minimal.module.css';
import Link from 'next/link';

interface NavbarLinkProps {
  icon: typeof IconHome2;
  label: string;
  active?: boolean;
  onClick?: () => void;
  href?: string;
}

function NavbarLink({ icon: Icon, label, active, onClick, href }: NavbarLinkProps) {
  const button = (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton onClick={onClick} className={classes.link} data-active={active || undefined}>
        <Icon size={20} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );

  if (href) {
    return <Link href={href}>{button}</Link>;
  }

  return button;
}

const mockdata = [
  { icon: IconHome2, label: 'Home', href: '/protected' },
  { icon: IconList, label: 'My Decks', href: '/protected/decks' },
  { icon: IconCards, label: 'Collections', href: '/protected/collections' },
  { icon: IconSettings, label: 'Settings', href: '/protected/settings' },
];

export function NavbarMinimal() {
  const [active, setActive] = useState(1);

  const links = mockdata.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      onClick={() => setActive(index)}
    />
  ));

  return (
    <nav className={classes.navbar}>
      <Center>
        <IconCards size={30} stroke={1.5} />
      </Center>

      <div className={classes.navbarMain}>
        <Stack justify="center" gap={0}>
          {links}
        </Stack>
      </div>

      <Stack justify="center" gap={0}>
        <NavbarLink icon={IconLogout} label="Logout" />
      </Stack>
    </nav>
  );
}
