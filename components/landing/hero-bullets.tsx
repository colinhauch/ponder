'use client';

import Link from 'next/link';
import { IconSparkles, IconStack2, IconTrendingUp } from '@tabler/icons-react';
import { Button, Container, Group, List, Text, ThemeIcon, Title } from '@mantine/core';
import classes from './hero-bullets.module.css';

export function HeroBullets() {
  return (
    <Container size="md">
      <div className={classes.inner}>
        <div className={classes.content}>
          <Title className={classes.title}>
            Build, brew, and{' '}
            <span className={classes.highlight}>master</span>
            <br /> your Magic decks
          </Title>
          <Text c="dimmed" mt="md" size="lg">
            Explore strategies, track your collection, and discover new synergies with the most
            intuitive deck building platform for Magic: The Gathering.
          </Text>

          <List
            mt={30}
            spacing="sm"
            size="sm"
            icon={
              <ThemeIcon size={20} radius="xl" variant="gradient" gradient={{ from: 'violet', to: 'cyan', deg: 45 }}>
                <IconSparkles size={12} stroke={1.5} />
              </ThemeIcon>
            }
          >
            <List.Item>
              <b>Powerful deck builder</b> – Create and optimize your decks with advanced filtering,
              sorting, and card recommendations
            </List.Item>
            <List.Item>
              <b>Track your collection</b> – Manage your cards across multiple formats and easily
              see what you own
            </List.Item>
            <List.Item>
              <b>Discover synergies</b> – Get AI-powered suggestions for cards that work well
              together in your strategy
            </List.Item>
          </List>

          <Group mt={30}>
            <Button
              component={Link}
              href="/auth/sign-up"
              radius="xl"
              size="md"
              variant="gradient"
              gradient={{ from: 'violet', to: 'cyan', deg: 45 }}
              className={classes.control}
            >
              Get started
            </Button>
            <Button
              component={Link}
              href="/auth/login"
              variant="default"
              radius="xl"
              size="md"
              className={classes.control}
            >
              Sign in
            </Button>
          </Group>
        </div>
        <div className={classes.imageSection}>
          <div className={classes.cardStack}>
            <div className={classes.card} style={{ transform: 'rotate(-8deg) translateX(-20px)' }}>
              <IconStack2 size={120} stroke={1} opacity={0.3} />
            </div>
            <div className={classes.card} style={{ transform: 'rotate(0deg)' }}>
              <IconTrendingUp size={120} stroke={1} opacity={0.3} />
            </div>
            <div className={classes.card} style={{ transform: 'rotate(8deg) translateX(20px)' }}>
              <IconSparkles size={120} stroke={1} opacity={0.3} />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
