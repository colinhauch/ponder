import { Container, Group, Anchor } from '@mantine/core';
import Link from 'next/link';
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/logout-button";
import classes from '@/components/landing/header.module.css';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  return (
    <main style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header matching landing page style */}
      <header className={classes.header} style={{ flexShrink: 0 }}>
        <Container size="xl">
          <Group justify="space-between" py="md">
            <Anchor
              component={Link}
              href="/protected"
              className={classes.logo}
              underline="never"
            >
              ponder
            </Anchor>

            <Group gap="sm">
              {user?.email && (
                <>
                  <span style={{ fontSize: '14px' }}>{user.email}</span>
                  <LogoutButton />
                </>
              )}
            </Group>
          </Group>
        </Container>
      </header>

      {/* Content area */}
      <div style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
        {children}
      </div>
    </main>
  );
}
