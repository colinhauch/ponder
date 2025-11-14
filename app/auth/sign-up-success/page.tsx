import { Paper, Title, Text, Container } from '@mantine/core';
import { IconMailCheck } from '@tabler/icons-react';
import classes from './page.module.css';

export const runtime = 'edge';

export default function Page() {
  return (
    <div className={classes.container}>
      <Container size="xs">
        <Paper radius="md" p="xl" withBorder shadow="md" className={classes.paper}>
          <div className={classes.icon}>
            <IconMailCheck size={48} stroke={1.5} />
          </div>
          <Title order={2} className={classes.title}>
            Thank you for signing up!
          </Title>
          <Text size="sm" c="dimmed" className={classes.description}>
            Check your email to confirm
          </Text>
          <Text size="sm" mt="lg" ta="center">
            You&apos;ve successfully signed up. Please check your email to confirm your account before signing in.
          </Text>
        </Paper>
      </Container>
    </div>
  );
}
