"use client";

import { Audience } from "@/components/atoms/Audience";
import { PlayerCard } from "@/components/atoms/PlayerCard";
import { Result } from "@/components/atoms/Result";
import { SelectableCard } from "@/components/atoms/SelectableCard";
import { EmoButtons } from "@/components/features/EmoButtons";
import { ForceLogoutModal } from "@/components/features/Room/ForceLogoutModal";
import { toaster } from "@/components/ui/toaster";
import { POKER_NUMBERS } from "@/constants";
import { auth } from "@/libs/firebase";
import { gerRoomCollectionDoc } from "@/libs/firebase/dataStructure";
import { setEmoji } from "@/libs/firebase/setEmotion";
import { setCardsClose, setCardsOpen } from "@/libs/firebase/setOpenResult";
import {
  resetAllUserStoryPoints,
  setStoryPoint,
} from "@/libs/firebase/setStoryPoint";
import { useWatchOnlineMembers } from "@/libs/firebase/watchCurrentLoginUsers";
import { useEmotion } from "@/libs/firebase/watchEmotion";
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
import { signOut } from "firebase/auth";
import { updateDoc } from "firebase/firestore";
import { useAtom } from "jotai";
import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import { InitialModal } from "./InitialModal";

type Props = {
  roomId: string;
};

export const Room = ({ roomId }: Props): ReactNode => {
  const { open: initialLoginOpen, onClose: handleIInitialLoginClose } =
    useDisclosure({ defaultOpen: true });
  const {
    open: forceLogoutOpen,
    onOpen: handleForceLogoutOpen,
    onClose: handleForceLogoutClose,
  } = useDisclosure({ defaultOpen: false });
  const [selectedCardUid, setSelectedCardUid] = useState("");
  const [user, setUser] = useAtom(userAtom);
  const { players, overDiffUserUIds, all } = useWatchOnlineMembers(roomId);
  const { isCardsOpen } = useWatchRoom(roomId);
  const { emotions } = useEmotion(roomId);

  const userId = auth.currentUser?.uid ?? "";

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
      error;
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

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      cleanup();
    };
  }, [handleLogout]);

  const handleClickEmoji = (emoji: string) => {
    setEmoji(roomId, userId, emoji);
  };

  return (
    <Box h="calc(100vh - 64px)" overflowY="auto" p={4}>
      <EmoButtons onClick={handleClickEmoji} />
      <VStack gap={8} minH="min-content">
        <Box
          w="full"
          maxW="1600px"
          minH="200px"
          bg="blue.50"
          p={4}
          rounded="lg"
        >
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
                    selectedNumber={user.point}
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
        <Box
          w="full"
          maxW="1600px"
          minH="300px"
          bg="gray.50"
          p={4}
          rounded="lg"
        >
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
                base: "repeat(4, 1fr)",
                sm: "repeat(6, 1fr)",
                md: "repeat(8, 1fr)",
                lg: "repeat(10, 1fr)",
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
                  colorPalette="orange"
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
                  colorPalette="teal"
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
              <Box py={2} minH="130px">
                <Result
                  points={players
                    .filter((player) => player.point !== -1)
                    .map((player) => player.point)}
                />
              </Box>
            ) : (
              <Box
                py={4}
                minH="130px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text color="gray.500" fontSize="sm" textAlign="center">
                  開票ボタンをクリックすると、投票結果が表示されます
                </Text>
              </Box>
            )}
          </VStack>
        </Box>
        {all.length > 0 && (
          <HStack
            maxW="1600px"
            w="full"
            justify="space-around"
            bg="red.50"
            p={4}
            rounded="lg"
          >
            {all.map(({ imageType, uid }) => (
              <Audience
                key={uid}
                type={
                  imageType as
                    | "0"
                    | "1"
                    | "2"
                    | "3"
                    | "4"
                    | "5"
                    | "6"
                    | "7"
                    | "8"
                    | "9"
                }
                uid={uid}
                emotion={emotions.find((e) => e.uid === uid)}
              />
            ))}
          </HStack>
        )}
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
    </Box>
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
