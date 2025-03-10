"use client";

import { PlayerCard } from "@/components/atoms/PlayerCard";
import { Result } from "@/components/atoms/Result";
import { SelectableCard } from "@/components/atoms/SelectableCard";
import { ForceLogoutModal } from "@/components/features/Room/ForceLogoutModal";
import { toaster } from "@/components/ui/toaster";
import { POKER_NUMBERS } from "@/constants";
import { auth } from "@/libs/firebase";
import { gerRoomCollectionDoc } from "@/libs/firebase/dataStructure";
import { setCardsClose, setCardsOpen } from "@/libs/firebase/setOpenResult";
import {
  resetAllUserStoryPoints,
  setStoryPoint,
} from "@/libs/firebase/setStoryPoint";
import { useWatchOnlineMembers } from "@/libs/firebase/watchCurrentLoginUsers";
import { useWatchRoom } from "@/libs/firebase/watchRoom";
import { defaultUserAtom, userAtom } from "@/store/user";
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

export const Room = ({ roomId }: Props): ReactNode => {
  const [isLoading, setIsLoading] = useState(true);
  const { open: initialLoginOpen, onClose: handleIInitialLoginClose } =
    useDisclosure({ defaultOpen: true });
  const {
    open: forceLogoutOpen,
    onOpen: handleForceLogoutOpen,
    onClose: handleForceLogoutClose,
  } = useDisclosure({ defaultOpen: false });
  const [selectedCardUid, setSelectedCardUid] = useState("");
  const [user, setUser] = useAtom(userAtom);
  const { players, overDiffUserUIds } = useWatchOnlineMembers(roomId);
  const { isCardsOpen } = useWatchRoom(roomId);

  const userId = auth.currentUser?.uid ?? "";

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
    if (!userId) return;

    try {
      const userInfoRef = gerRoomCollectionDoc(roomId, userId);
      await updateDoc(userInfoRef, {
        isOnline: false,
      });
      await signOut(auth);
      setUser(defaultUserAtom);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "不明なエラーが発生しました";
      toaster.create({
        type: "error",
        description: `ログアウトに失敗しました。\n${errorMessage}`,
      });
    }
  }, [roomId, setUser, userId]);

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
      <VStack minH="calc(100vh - 64px)">
        <Text>ローディング中...</Text>
      </VStack>
    );
  }

  return (
    <VStack minH="calc(100vh - 64px)" gap={8} p={4}>
      <Box w="full" maxW="1600px" minH="200px" bg="blue.50" p={4} rounded="lg">
        <VStack w="full" gap={4}>
          <Text fontSize="lg" fontWeight="bold">
            ポイントを選択してください
          </Text>
          <Grid
            templateColumns={{
              base: "repeat(3, 1fr)",
              sm: "repeat(5, 1fr)",
              md: "repeat(8, 1fr)",
              lg: "repeat(10, 1fr)",
            }}
            gap={4}
            w="full"
          >
            {POKER_NUMBERS.map((number) => (
              <Box key={number} minH="60px">
                <SelectableCard
                  number={number}
                  isCardsOpen={isCardsOpen}
                  onClick={() => {
                    if (user.role !== "player") {
                      toaster.create({
                        type: "error",
                        description: "プレイヤー以外は選択できません",
                      });
                      return;
                    }
                    setStoryPoint(roomId, userId, number);
                  }}
                />
              </Box>
            ))}
          </Grid>
        </VStack>
      </Box>

      <Box w="full" maxW="1600px" minH="300px" bg="gray.50" p={4} rounded="lg">
        {players.length === 0 ? (
          <VStack justify="center" h="300px">
            <Text fontSize="lg" color="gray.600">
              プレイヤーを募集中です...
            </Text>
            <Text fontSize="sm" color="gray.500">
              他のプレイヤーの参加をお待ちください
            </Text>
          </VStack>
        ) : (
          <Grid
            templateColumns={{
              base: "repeat(2, 1fr)",
              sm: "repeat(3, 1fr)",
              md: "repeat(4, 1fr)",
              lg: "repeat(5, 1fr)",
            }}
            gap={4}
            w="full"
          >
            {players.map(({ uid, point }) => (
              <Box key={uid} minH="120px">
                <PlayerCard
                  uid={uid}
                  selectedNumber={point}
                  status={getCardStatus(point, isCardsOpen)}
                  onClickUnselected={() => {
                    if (user.role !== "player") {
                      toaster.create({
                        type: "error",
                        description:
                          "プレイヤー以外は強制ログアウトさせることはできません",
                      });
                      return;
                    }
                    setSelectedCardUid(uid);
                    handleForceLogoutOpen();
                  }}
                  onClickSelected={() => setStoryPoint(roomId, uid, -1)}
                  diff={overDiffUserUIds.includes(uid)}
                />
              </Box>
            ))}
          </Grid>
        )}
      </Box>

      <Box w="full" maxW="1600px" bg="green.50" p={4} rounded="lg">
        <VStack gap={6} w="full">
          <Box>
            <Text fontSize="lg" fontWeight="bold" mb={4} textAlign="center">
              投票結果
            </Text>
            <HStack gap={4} justify="center" w="full">
              <Button
                colorScheme="green"
                onClick={async () => {
                  if (user.role !== "player") {
                    toaster.create({
                      type: "error",
                      description: "プレイヤー以外は開票できません",
                    });
                    return;
                  }
                  await setCardsOpen(roomId);
                }}
              >
                開票
              </Button>
              <Button
                colorScheme="blue"
                onClick={async () => {
                  if (user.role !== "player") {
                    toaster.create({
                      type: "error",
                      description: "プレイヤー以外はリセットできません",
                    });
                    return;
                  }
                  await setCardsClose(roomId);
                  await resetAllUserStoryPoints(roomId);
                }}
              >
                リセット
              </Button>
            </HStack>
          </Box>
          {isCardsOpen ? (
            <Box py={2}>
              <Result
                points={players
                  .filter((player) => player.point !== -1)
                  .map((player) => player.point)}
              />
            </Box>
          ) : (
            <Box py={4}>
              <Text color="gray.500" fontSize="sm" textAlign="center">
                開票ボタンをクリックすると、投票結果が表示されます
              </Text>
            </Box>
          )}
        </VStack>
      </Box>

      <InitialModal
        isOpen={initialLoginOpen}
        onClose={handleIInitialLoginClose}
        roomId={roomId}
      />
      <ForceLogoutModal
        isOpen={forceLogoutOpen}
        onClose={handleForceLogoutClose}
        roomId={roomId}
        uid={selectedCardUid}
      />
    </VStack>
  );
};

function getCardStatus(storyPoint: number, isCardsOpen: boolean) {
  if (isCardsOpen) {
    return "opened";
  }

  if (storyPoint === -1) {
    return "unselected";
  }

  return "selected";
}
