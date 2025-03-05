import { Text, VStack } from "@chakra-ui/react";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "@/libs/firebase";
import { notFound } from "next/navigation";

type Props = {
  params: {
    roomId: string;
  };
};

export default async function RoomPage({ params }: Props) {
  const { roomId } = await Promise.resolve(params);
  const roomRef = doc(collection(db, "mitsumori", "room", roomId));
  const roomDoc = await getDoc(roomRef);

  if (!roomDoc.exists()) {
    notFound();
  }

  return (
    <VStack minH="100vh" justify="center" align="center">
      <Text>ルームID: {roomId}</Text>
    </VStack>
  );
}
