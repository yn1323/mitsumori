import { userAtom } from "@/store/user";
import { Image, Text, VStack } from "@chakra-ui/react";
import { useAtom } from "jotai";

type Props = {
  type: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
  uid: string;
  emoji: string;
};

export const Audience = ({ type, uid, emoji = "" }: Props) => {
  const [user] = useAtom(userAtom);

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
        {emoji !== "" && (
          <Text
            fontSize="2xl"
            key={Date.now()}
            style={{
              position: "absolute",
              top: "-30px",
              left: "28px",
              animation: "floatUp 1s ease-in forwards",
            }}
          >
            {emoji}
          </Text>
        )}
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
