"use client";

import { toaster } from "@/components/ui/toaster";
import { db } from "@/libs/firebase";
import { Box, Button, VStack } from "@chakra-ui/react";
import { collection, doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export const CreateRoom = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);

    try {
      const newRoomId = uuidv4();
      const roomRef = doc(
        collection(db, "mitsumori", "room", newRoomId),
        "_roomInfo",
      );
      await setDoc(roomRef, {
        createdAt: new Date(),
      });

      router.push(`/${newRoomId}`);
      toaster.create({
        type: "success",
        description: "ルームを作成しました",
      });
    } catch (error) {
      setIsLoading(false);
      toaster.create({
        type: "error",
        description: "ルームの作成に失敗しました",
      });
    }
  };

  return (
    <Box p={6} bg="white" shadow="md" rounded="md" width="600px">
      <VStack gap={4}>
        <Button
          colorScheme="blue"
          size="lg"
          width="full"
          onClick={handleClick}
          loadingText="作成中..."
          loading={isLoading}
        >
          ルームを作成
        </Button>
      </VStack>
    </Box>
  );
};
