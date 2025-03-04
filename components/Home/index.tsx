"use client";

import { Box, Button, Container, Flex, Heading, Text } from "@chakra-ui/react";
import { addDoc, collection } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

import { firestore } from "@/src/lib/firebase";

import "@/app/index.css";

export const Home = () => {
  const router = useRouter();

  const handleCreateRoom = async () => {
    const roomId = uuidv4();
    const roomRef = collection(firestore, "mitsumori", "room", roomId);
    await addDoc(roomRef, {
      createdAt: new Date(),
    });

    router.push(`/room/${roomId}`);
  };

  return (
    <Flex as="main" minH="100vh" align="center" justify="center">
      <Box
        p={8}
        maxW="md"
        w="full"
        borderWidth="1px"
        borderRadius="lg"
        boxShadow="md"
        bg="white"
      >
        <Heading size="md" mb={4}>見積もりルーム作成</Heading>
        <Text color="gray.600" mb={6}>
          新しい見積もりルームを作成して、チームでプランニングポーカーを始めましょう。
        </Text>
        <Button colorScheme="blue" w="full" onClick={handleCreateRoom}>
          ルームを作成
        </Button>
      </Box>
    </Flex>
  );
};
