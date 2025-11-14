import { Paper, Title, Container, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import classes from './page.module.css';

export const runtime = 'edge';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const params = await searchParams;

  return (
    <div className={classes.container}>
      <Container size="xs">
        <Paper radius="md" p="xl" withBorder shadow="md" className={classes.paper}>
          <div className={classes.icon}>
            <IconAlertCircle size={48} stroke={1.5} />
          </div>
          <Title order={2} className={classes.title}>
            Sorry, something went wrong.
          </Title>
          <Alert
            icon={<IconAlertCircle size={16} />}
            color="red"
            variant="light"
            mt="lg"
          >
            {params?.error ? (
              <>Code error: {params.error}</>
            ) : (
              <>An unspecified error occurred.</>
            )}
          </Alert>
        </Paper>
      </Container>
    </div>
  );
}
