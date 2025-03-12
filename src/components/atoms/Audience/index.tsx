import type { EmotionDocType } from "@/libs/firebase/dataStructure";
import { userAtom } from "@/store/user";
import { Image, Text, VStack } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";

type Props = {
  type: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
  uid: string;
  emotion?: EmotionDocType;
};

type EmojiItem = {
  id: number;
  emoji: string;
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const Audience = ({ type, uid, emotion = {} as any }: Props) => {
  const [user] = useAtom(userAtom);
  const [emojis, setEmojis] = useState<EmojiItem[]>([]);

  useEffect(() => {
    if (emotion.emoji !== "") {
      const newEmoji: EmojiItem = {
        id: Date.now(),
        emoji: emotion.emoji,
      };
      setEmojis((prev) => [...prev, newEmoji]);
    }
  }, [emotion]);

  useEffect(() => {
    const cleanup = emojis.map((emojiItem) => {
      const timer = setTimeout(() => {
        setEmojis((prev) => prev.filter((item) => item.id !== emojiItem.id));
      }, 1000);
      return () => clearTimeout(timer);
    });

    return () => {
      for (const clear of cleanup) {
        clear();
      }
    };
  }, [emojis]);

  return (
    <>
      <style>
        {`
          @keyframes floatUp {
            0% {
              transform: translateY(0);
              opacity: 1;
            }
            60% {
              opacity: 0.8;
            }
            100% {
              transform: translateY(-120px);
              opacity: 0;
            }
          }
        `}
      </style>
      <VStack gap="2" position="relative">
        {emojis.map((emojiItem) => (
          <Text
            key={emojiItem.id}
            fontSize="2xl"
            style={{
              position: "absolute",
              top: "-30px",
              left: "28px",
              animation: "floatUp 1s ease-in forwards",
            }}
          >
            {emojiItem.emoji}
          </Text>
        ))}
        <Image
          src={`/img/${type}.svg`}
          alt={`Story point ${type}`}
          width="80px"
          height="80px"
          objectFit="contain"
        />
        {user.uid === uid && (
          <VStack gap={0} alignItems="center">
            <Text
              fontSize="sm"
              color="gray.500"
              fontWeight="bold"
              lineHeight={1}
            >
              ▲
            </Text>
            <Text fontSize="sm" fontWeight="bold" color="gray.500">
              YOU
            </Text>
          </VStack>
        )}
      </VStack>
    </>
  );
};
