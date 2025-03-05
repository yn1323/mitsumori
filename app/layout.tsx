import { Provider } from "@/components/ui/provider";
import { Box, Flex, Text } from "@chakra-ui/react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Provider>
          <Box
            position="fixed"
            top={0}
            left={0}
            right={0}
            bg="white"
            shadow="sm"
            zIndex={1}
          >
            <Flex px={4} py={3} maxW="container.xl" mx="auto" align="center">
              <Link href="/" style={{ textDecoration: "none", display: "block" }}>
                <Text
                  fontSize="xl"
                  fontWeight="bold"
                  _hover={{ opacity: 0.8 }}
                  cursor="pointer"
                >
                  MITSUMORI
                </Text>
              </Link>
            </Flex>
          </Box>
          <Box pt={16}>{children}</Box>
        </Provider>
      </body>
    </html>
  );
}
