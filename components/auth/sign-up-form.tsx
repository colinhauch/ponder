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
  Anchor,
  Alert,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle } from '@tabler/icons-react';
import { createClient } from '@/lib/supabase/client';
import classes from './sign-up-form.module.css';

export function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) => (val.length >= 6 ? null : 'Password must be at least 6 characters'),
      confirmPassword: (value, values) =>
        value !== values.password ? 'Passwords do not match' : null,
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      // Get redirect destination from query params, validate it's internal
      const next = searchParams.get('next');
      const redirectTo = next && next.startsWith('/') ? next : '/protected';

      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: `${window.location.origin}${redirectTo}`,
        },
      });
      if (error) throw error;
      router.push('/auth/sign-up-success');
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
            Create an account
          </Title>

          <Text size="sm" c="dimmed" className={classes.description}>
            Enter your details to create a new account
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

              <PasswordInput
                label="Password"
                placeholder="Your password"
                required
                radius="md"
                {...form.getInputProps('password')}
              />

              <PasswordInput
                label="Confirm Password"
                placeholder="Repeat your password"
                required
                radius="md"
                {...form.getInputProps('confirmPassword')}
              />

              <Button
                type="submit"
                fullWidth
                radius="md"
                mt="md"
                loading={isLoading}
                variant="gradient"
                gradient={{ from: 'violet', to: 'cyan', deg: 45 }}
              >
                Sign up
              </Button>
            </Stack>
          </form>

          <div className={classes.footer}>
            <Text size="sm" c="dimmed">
              Already have an account?{' '}
              <Anchor component={Link} href="/auth/login" size="sm">
                Login
              </Anchor>
            </Text>
          </div>
        </Paper>
      </Container>
    </div>
  );
}
