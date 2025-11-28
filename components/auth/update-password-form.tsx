'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Paper,
  PasswordInput,
  Button,
  Title,
  Text,
  Container,
  Stack,
  Alert,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle } from '@tabler/icons-react';
import { createClient } from '@/lib/supabase/client';
import classes from './update-password-form.module.css';

export function UpdatePasswordForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      password: '',
    },
    validate: {
      password: (val) => (val.length >= 6 ? null : 'Password must be at least 6 characters'),
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({ password: values.password });
      if (error) throw error;
      router.push('/protected');
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
            Reset Your Password
          </Title>

          <Text size="sm" c="dimmed" className={classes.description}>
            Please enter your new password below.
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
              <PasswordInput
                label="New Password"
                placeholder="Enter your new password"
                required
                radius="md"
                {...form.getInputProps('password')}
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
                Save new password
              </Button>
            </Stack>
          </form>
        </Paper>
      </Container>
    </div>
  );
}
