"use client";

import { toaster } from "@/components/ui/toaster";
import { auth } from "@/libs/firebase";
import { Text, VStack } from "@chakra-ui/react";
import { signInAnonymously, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
type Props = {
  roomId: string;
};

export const Room = ({ roomId }: Props) => {
  const [isLoading, setIsLoading] = useState(true);

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
    </VStack>
  );
};
