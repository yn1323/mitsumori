"use client";

import { toaster } from "@/components/ui/toaster";
import { auth } from "@/libs/firebase";
import { Text, VStack, useDisclosure } from "@chakra-ui/react";
import { signInAnonymously, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { InitialModal } from "./InitialModal";
type Props = {
  roomId: string;
};

export const Room = ({ roomId }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const { open: isOpen, onClose } = useDisclosure({ defaultOpen: true });

  useEffect(() => {
    const cleanup = () => {
      signOut(auth).catch((error) => {
        const errorMessage =
          error instanceof Error ? error.message : "不明なエラーが発生しました";
        toaster.create({
          type: "error",
          description: `ログアウトに失敗しました。\n${errorMessage}`,
        });
      });
    };

    const handleBeforeUnload = () => {
      cleanup();
    };

    const signIn = async () => {
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
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    signIn();

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      cleanup();
    };
  }, []);

  if (isLoading) {
    return (
      <VStack minH="100vh" justify="center" align="center">
        <Text>ローディング中...</Text>
      </VStack>
    );
  }

  return (
    <VStack minH="100vh" justify="center" align="center">
      <Text>ルームID: {roomId}</Text>
      <InitialModal isOpen={isOpen} onClose={onClose} roomId={roomId} />
    </VStack>
  );
};
