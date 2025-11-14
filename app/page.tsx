import { Box } from '@mantine/core';
import { Header } from "@/components/landing/header";
import { HeroBullets } from "@/components/landing/hero-bullets";
import { Footer } from "@/components/landing/footer";

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
