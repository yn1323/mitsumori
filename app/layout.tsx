import { CopyUrlButton } from "@/components/features/Header/CopyUrlButton";
import { AuthGuard } from "@/components/templates/AuthGuard";
import { ClientWrapper } from "@/components/templates/ClientWrapper";
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
  title: "MITSUMORI",
  description: "みんなで参加するプランニングポーカー",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
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
              <Link
                href="/"
                style={{ textDecoration: "none", display: "block" }}
              >
                <Text
                  fontSize="2xl"
                  fontWeight="bold"
                  _hover={{ opacity: 0.8 }}
                  cursor="pointer"
                >
                  MITSUMORI
                </Text>
              </Link>
              <Box ml="auto">
                <CopyUrlButton />
              </Box>
            </Flex>
          </Box>
          <Box pt={16}>
            <AuthGuard>{children}</AuthGuard>
          </Box>
          <ClientWrapper />
        </Provider>
      </body>
    </html>
  );
}
