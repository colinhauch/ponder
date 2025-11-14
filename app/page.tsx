import { Box } from '@mantine/core';
import { Header } from "@/components/landing/header";
import { HeroBullets } from "@/components/landing/hero-bullets";
import { Footer } from "@/components/landing/footer";

// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <Box style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <Box component="main" style={{ flex: 1 }}>
        <HeroBullets />
      </Box>

      <Footer />
    </Box>
  );
}
