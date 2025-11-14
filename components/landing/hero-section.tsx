'use client';

import Link from "next/link";
import { Container, Grid, Title, Text, Button, Card, Flex } from '@mantine/core';
import { IconPhoto } from '@tabler/icons-react';
import classes from './hero-section.module.css';

export function HeroSection() {
  return (
    <div className={classes.hero}>
      <Container size="xl">
        <Grid gutter="xl" align="center">
          {/* Left side - Text content */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <div className={classes.heroContent}>
              <Title className={classes.title} order={1}>
                Build, brew, and{' '}
                <Text
                  component="span"
                  inherit
                  variant="gradient"
                  gradient={{ from: 'violet', to: 'cyan', deg: 45 }}
                >
                  master
                </Text>{' '}
                your Magic decks
              </Title>

              <Text size="xl" className={classes.description} mt={30}>
                Explore strategies, track your collection, and discover new synergies with the most intuitive deck building platform for Magic: The Gathering.
              </Text>

              <Button
                component={Link}
                href="/get-started"
                variant="gradient"
                gradient={{ from: 'violet', to: 'cyan', deg: 45 }}
                size="lg"
                className={classes.control}
                mt={40}
              >
                Get Started
              </Button>
            </div>
          </Grid.Col>

          {/* Right side - Card grid */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Grid gutter="md" className={classes.cardGrid}>
              {[...Array(6)].map((_, i) => (
                <Grid.Col span={4} key={i}>
                  <Card
                    shadow="lg"
                    padding={0}
                    radius="md"
                    className={classes.magicCard}
                    withBorder
                  >
                    <Flex
                      align="center"
                      justify="center"
                      style={{ height: '100%' }}
                    >
                      <IconPhoto size={48} opacity={0.5} />
                    </Flex>
                  </Card>
                </Grid.Col>
              ))}
            </Grid>
          </Grid.Col>
        </Grid>
      </Container>
    </div>
  );
}
