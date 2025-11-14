'use client';

import Link from "next/link";
import { Container, Grid, Text, Anchor, Stack, Box } from '@mantine/core';
import classes from './footer.module.css';

export function Footer() {
  return (
    <Box component="footer" className={classes.footer}>
      <Container size="xl">
        <Grid gutter="xl">
          <Grid.Col span={{ base: 6, md: 3 }}>
            <Stack gap="sm" className={classes.footerSection}>
              <Text fw={600} size="sm">Product</Text>
              <Stack gap="xs">
                <Anchor component={Link} href="/features" c="dimmed" size="sm">
                  Features
                </Anchor>
                <Anchor component={Link} href="/pricing" c="dimmed" size="sm">
                  Pricing
                </Anchor>
              </Stack>
            </Stack>
          </Grid.Col>
          <Grid.Col span={{ base: 6, md: 3 }}>
            <Stack gap="sm" className={classes.footerSection}>
              <Text fw={600} size="sm">Resources</Text>
              <Stack gap="xs">
                <Anchor component={Link} href="/documentation" c="dimmed" size="sm">
                  Documentation
                </Anchor>
                <Anchor component={Link} href="/guides" c="dimmed" size="sm">
                  Guides
                </Anchor>
              </Stack>
            </Stack>
          </Grid.Col>
          <Grid.Col span={{ base: 6, md: 3 }}>
            <Stack gap="sm" className={classes.footerSection}>
              <Text fw={600} size="sm">Company</Text>
              <Stack gap="xs">
                <Anchor component={Link} href="/about" c="dimmed" size="sm">
                  About Us
                </Anchor>
                <Anchor component={Link} href="/contact" c="dimmed" size="sm">
                  Contact
                </Anchor>
              </Stack>
            </Stack>
          </Grid.Col>
          <Grid.Col span={{ base: 6, md: 3 }}>
            <Stack gap="sm" className={classes.footerSection}>
              <Text fw={600} size="sm">Legal</Text>
              <Stack gap="xs">
                <Anchor component={Link} href="/privacy" c="dimmed" size="sm">
                  Privacy
                </Anchor>
                <Anchor component={Link} href="/terms" c="dimmed" size="sm">
                  Terms
                </Anchor>
              </Stack>
            </Stack>
          </Grid.Col>
        </Grid>
        <Box mt={48} pt="xl" style={{ borderTop: '1px solid var(--mantine-color-default-border)' }}>
          <Text ta="center" size="sm" c="dimmed">
            &copy; 2025 Ponder. All rights reserved.
          </Text>
        </Box>
      </Container>
    </Box>
  );
}
