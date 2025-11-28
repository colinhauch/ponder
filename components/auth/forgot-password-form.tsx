'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Paper,
  TextInput,
  Button,
  Title,
  Text,
  Container,
  Stack,
  Anchor,
  Alert,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle, IconMailCheck } from '@tabler/icons-react';
import { createClient } from '@/lib/supabase/client';
import classes from './forgot-password-form.module.css';

export function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
    },
    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/update-password`,
      });
      if (error) throw error;
      setSuccess(true);
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
          {success ? (
            <>
              <div className={classes.successIcon}>
                <IconMailCheck size={48} stroke={1.5} />
              </div>
              <Title order={2} className={classes.title}>
                Check Your Email
              </Title>
              <Text size="sm" c="dimmed" className={classes.description}>
                Password reset instructions sent
              </Text>
              <Alert
                icon={<IconMailCheck size={16} />}
                color="green"
                variant="light"
                mt="lg"
              >
                If you registered using your email and password, you will receive a password reset email.
              </Alert>
              <div className={classes.footer}>
                <Text size="sm" c="dimmed">
                  Remember your password?{' '}
                  <Anchor component={Link} href="/auth/login" size="sm">
                    Login
                  </Anchor>
                </Text>
              </div>
            </>
          ) : (
            <>
              <Title order={2} className={classes.title}>
                Reset Your Password
              </Title>

              <Text size="sm" c="dimmed" className={classes.description}>
                Type in your email and we&apos;ll send you a link to reset your password
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

                  <Button
                    type="submit"
                    fullWidth
                    radius="md"
                    mt="md"
                    loading={isLoading}
                    variant="gradient"
                    gradient={{ from: 'violet', to: 'cyan', deg: 45 }}
                  >
                    Send reset email
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
            </>
          )}
        </Paper>
      </Container>
    </div>
  );
}
