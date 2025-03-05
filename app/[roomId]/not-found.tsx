import { Button, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main>
      <VStack minH="100vh" justify="center" align="center" gap={4}>
        <Text fontSize="xl" fontWeight="bold">
          ルームが見つかりませんでした
        </Text>
        <Link href="/" passHref legacyBehavior>
          <Button as="a" colorScheme="blue">
            トップページに戻る
          </Button>
        </Link>
      </VStack>
    </main>
  );
}
