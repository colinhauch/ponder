import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import "./globals.css";
import '@mantine/core/styles.css';

const defaultUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Ponder - Magic: The Gathering Deck Builder",
  description: "Build, brew, and master your Magic decks with the most intuitive deck building platform for Magic: The Gathering.",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
      </head>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MantineProvider
            defaultColorScheme="dark"
            theme={{
              primaryColor: 'violet',
              colors: {
                violet: [
                  '#f3f0ff',
                  '#e5dbff',
                  '#d0bfff',
                  '#b197fc',
                  '#9775fa',
                  '#845ef7',
                  '#7950f2',
                  '#7048e8',
                  '#6741d9',
                  '#5f3dc4',
                ],
              },
            }}
          >
            {children}
          </MantineProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
