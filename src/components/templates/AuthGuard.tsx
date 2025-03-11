"use client";

import { Loading } from "@/components/ui/loading";
import { toaster } from "@/components/ui/toaster";
import { auth } from "@/libs/firebase";
import { VStack } from "@chakra-ui/react";
import { signInAnonymously } from "firebase/auth";
import { type ReactNode, useCallback, useEffect, useState } from "react";

export const AuthGuard = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const signIn = useCallback(async () => {
    try {
      await signInAnonymously(auth);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "不明なエラーが発生しました";
      toaster.create({
        type: "error",
        description: `初期化に失敗しました。リフレッシュして再度試してください。\n${errorMessage}`,
      });
    }
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        await signIn();
      }
      setIsAuthenticated(true);
    });

    return () => unsubscribe();
  }, [signIn]);

  if (!isAuthenticated) {
    return (
      <VStack minH="calc(100vh - 64px)" justify="center" align="center">
        <Loading />
      </VStack>
    );
  }

  return <>{children}</>;
};
