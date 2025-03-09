"use client";

import { toaster } from "@/components/ui/toaster";
import { auth } from "@/libs/firebase";
import { getMembersInfoRef } from "@/libs/firebase/dataStructure";
import { Box, Grid, Text, VStack, useDisclosure } from "@chakra-ui/react";
import { signInAnonymously, signOut } from "firebase/auth";
import { updateDoc } from "firebase/firestore";
import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import { InitialModal } from "./InitialModal";
type Props = {
  roomId: string;
};

const POKER_NUMBERS = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55] as const;

export const Room = ({ roomId }: Props): ReactNode => {
  const [isLoading, setIsLoading] = useState(true);
  const { open: isOpen, onClose } = useDisclosure({ defaultOpen: true });

  const signIn = useCallback(async () => {
    try {
      await signInAnonymously(auth);
      setIsLoading(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "不明なエラーが発生しました";
      toaster.create({
        type: "error",
        description: `初期化に失敗しました。リフレッシュして再度試してください。\n${errorMessage}`,
      });
      setIsLoading(false);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    try {
      const memberInfoRef = getMembersInfoRef(roomId, userId);
      await updateDoc(memberInfoRef, {
        isOnline: false,
      });
      await signOut(auth);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "不明なエラーが発生しました";
      toaster.create({
        type: "error",
        description: `ログアウトに失敗しました。\n${errorMessage}`,
      });
    }
  }, [roomId]);

  useEffect(() => {
    const cleanup = async () => {
      await handleLogout();
    };

    const handleBeforeUnload = async () => {
      await cleanup();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    signIn();

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      cleanup();
    };
  }, [signIn, handleLogout]);

  if (isLoading) {
    return (
      <VStack minH="100vh" justify="center" align="center">
        <Text>ローディング中...</Text>
      </VStack>
    );
  }

  return (
    <VStack minH="100vh" justify="center" align="center" gap={8} p={4}>
      <Text>ルームID: {roomId}</Text>
      <Grid
        templateColumns={{
          base: "repeat(2, 1fr)",
          sm: "repeat(5, 1fr)",
          md: "repeat(10, 1fr)",
        }}
        gap={4}
        w="full"
        maxW="1600px"
      >
        {POKER_NUMBERS.map((number) => (
          <Box
            key={number}
            bg="white"
            border="1px"
            borderColor="gray.200"
            borderRadius="lg"
            boxShadow="lg"
            aspectRatio="2/3"
            maxW="120px"
            w="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
            cursor="pointer"
            transition="transform 0.2s"
            _hover={{
              transform: "translateY(-4px)",
              boxShadow: "xl",
              bg: "gray.50",
            }}
          >
            <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold">
              {number}
            </Text>
          </Box>
        ))}
      </Grid>
      <InitialModal isOpen={isOpen} onClose={onClose} roomId={roomId} />
    </VStack>
  );
};
