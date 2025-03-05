"use client";

import { Box, Button, Text, VStack } from "@chakra-ui/react";
import { collection, doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/libs/firebase";

export const CreateRoom = () => {
  const router = useRouter();
  const [alert, setAlert] = useState<{
    status: "success" | "error";
    message: string;
  } | null>(null);

  const handleClick = async () => {
    try {
      const newRoomId = uuidv4();
      const roomRef = doc(collection(db, "mitsumori", "room", newRoomId));
      await setDoc(roomRef, {
        createdAt: new Date(),
      });

      router.push(`/${newRoomId}`);
    } catch (error) {
      console.error(error);
      setAlert({
        status: "error",
        message: "ルームの作成に失敗しました",
      });
    }
  };

  return (
    <Box p={6} bg="white" shadow="md" rounded="md" width="600px">
      <VStack gap={4}>
        {alert && (
          <Text
            color={alert.status === "success" ? "green.500" : "red.500"}
            fontWeight="bold"
          >
            {alert.message}
          </Text>
        )}
        <Button
          colorScheme="blue"
          size="lg"
          width="full"
          onClick={handleClick}
        >
          ルームを作成
        </Button>
      </VStack>
    </Box>
  );
};
