"use client";

import { PlayerCard } from "@/components/atoms/PlayerCard";
import { SelectableCard } from "@/components/atoms/SelectableCard";
import { toaster } from "@/components/ui/toaster";
import { auth } from "@/libs/firebase";
import { getMembersInfoRef } from "@/libs/firebase/dataStructure";
import { useOnlineMembers } from "@/libs/firebase/watchCurrentLoginUsers";
import { userAtom } from "@/store/user";
import {
  Box,
  Button,
  Grid,
  HStack,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { signInAnonymously, signOut } from "firebase/auth";
import { updateDoc } from "firebase/firestore";
import { useAtom } from "jotai";
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
  const [user, setUser] = useAtom(userAtom);
  const onlineMembers = useOnlineMembers(roomId);

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
      setUser(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "不明なエラーが発生しました";
      toaster.create({
        type: "error",
        description: `ログアウトに失敗しました。\n${errorMessage}`,
      });
    }
  }, [roomId, setUser]);

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
      <VStack w="full" maxW="1600px" gap={4}>
        <VStack align="start" w="full" gap={2}>
          <Text as="pre" fontSize="sm">
            {JSON.stringify(user, null, 2)}
          </Text>
          <Text as="pre" fontSize="sm">
            オンラインメンバー:
            {JSON.stringify(onlineMembers, null, 2)}
          </Text>
        </VStack>
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
            <SelectableCard key={number} number={number} />
          ))}
        </Grid>
      </VStack>
      <Box w="full" maxW="1600px">
        <Grid templateColumns="repeat(3, 1fr)" gap={4} w="full">
          <PlayerCard status="unselected" />
          <PlayerCard status="selected" />
          <PlayerCard status="opened" selectedNumber={8} diff={true} />
        </Grid>
      </Box>

      <HStack gap={4}>
        <Button colorScheme="blue">リセット</Button>
        <Button colorScheme="green">開票</Button>
      </HStack>
      <InitialModal isOpen={isOpen} onClose={onClose} roomId={roomId} />
    </VStack>
  );
};
