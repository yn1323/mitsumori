import { userAtom } from "@/store/user";
import { Image, Text, VStack } from "@chakra-ui/react";
import { useAtom } from "jotai";

type Props = {
  type: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
  uid: string;
};

export const Audience = ({ type, uid }: Props) => {
  const [user] = useAtom(userAtom);

  return (
    <VStack gap="2">
      <Image
        src={`/img/${type}.svg`}
        alt={`Story point ${type}`}
        width="80px"
        height="80px"
        objectFit="contain"
      />
      {user.uid === uid && (
        <VStack gap={0} alignItems="center">
          <Text fontSize="sm" color="gray.500" fontWeight="bold" lineHeight={1}>
            ▲
          </Text>
          <Text fontSize="sm" fontWeight="bold" color="gray.500">
            YOU
          </Text>
        </VStack>
      )}
    </VStack>
  );
};
