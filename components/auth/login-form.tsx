'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Container,
  Stack,
  Group,
  Anchor,
  Alert,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle } from '@tabler/icons-react';
import { createClient } from '@/lib/supabase/client';
import { BASE_PATH } from '@/lib/paths';
import classes from './login-form.module.css';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) => (val.length >= 1 ? null : 'Password is required'),
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      if (error) throw error;

      // Get redirect destination from query params, validate it's internal
      // Note: 'next' param comes from middleware with basePath included,
      // but router.push() auto-adds basePath, so we need to strip it first
      const next = searchParams.get('next');
      let redirectTo = '/protected'; // default
      if (next && next.startsWith('/')) {
        // Strip basePath if present (middleware adds it, router.push will re-add it)
        redirectTo = next.startsWith(BASE_PATH) ? next.slice(BASE_PATH.length) : next;
      }
      router.push(redirectTo);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <div className={classes.authContainer}>
      <Container size="xs">
        <Paper
          radius="md"
          p="xl"
          withBorder
          shadow="md"
          className={classes.authPaper}
        >
          <Title order={2} className={classes.title}>
            Welcome back!
          </Title>

          <Text size="sm" c="dimmed" className={classes.description}>
            Enter your email below to login to your account
          </Text>

          {error && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              color="red"
              variant="light"
              mb="lg"
              mt="md"
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack gap="md" mt="lg">
              <TextInput
                label="Email"
                placeholder="m@example.com"
                required
                radius="md"
                {...form.getInputProps('email')}
              />

              <div>
                <Group justify="space-between" mb={5}>
                  <Text component="label" size="sm" fw={500}>
                    Password
                  </Text>
                  <Anchor
                    component={Link}
                    href="/auth/forgot-password"
                    size="xs"
                    c="dimmed"
                  >
                    Forgot your password?
                  </Anchor>
                </Group>
                <PasswordInput
                  placeholder="Your password"
                  required
                  radius="md"
                  {...form.getInputProps('password')}
                />
              </div>

              <Button
                type="submit"
                fullWidth
                radius="md"
                mt="md"
                loading={isLoading}
                variant="gradient"
                gradient={{ from: 'violet', to: 'cyan', deg: 45 }}
              >
                Login
              </Button>
            </Stack>
          </form>

          <div className={classes.footer}>
            <Text size="sm" c="dimmed">
              Don&apos;t have an account?{' '}
              <Anchor component={Link} href="/auth/sign-up" size="sm">
                Sign up
              </Anchor>
            </Text>
          </div>
        </Paper>
      </Container>
    </div>
  );
}
