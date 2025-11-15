import { Box } from '@mantine/core';
import { AuthHeader } from '@/components/auth/auth-header';
import { Footer } from '@/components/landing/footer';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AuthHeader />

      <Box component="main" style={{ flex: 1 }}>
        {children}
      </Box>

      <Footer />
    </Box>
  );
}
