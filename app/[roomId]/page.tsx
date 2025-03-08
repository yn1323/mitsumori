import { Room } from "@/components/features/Room";
import { db } from "@/libs/firebase";
import { collection, doc, getDoc } from "firebase/firestore";
import { notFound } from "next/navigation";

type Props = {
  params: {
    roomId: string;
  };
};

export default async function RoomPage({ params }: Props) {
  const { roomId } = await Promise.resolve(params);
  const roomRef = doc(collection(db, "mitsumori", "room", roomId), "_roomInfo");
  const roomDoc = await getDoc(roomRef);

  if (!roomDoc.exists()) {
    notFound();
  }

  const data = roomDoc.data();
  const createdAt = data?.createdAt?.toDate();

  if (!createdAt) {
    notFound();
  }

  // 1ヶ月前の日付を計算
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  // createdAtが1ヶ月以上前の場合は404
  if (createdAt < oneMonthAgo) {
    notFound();
  }

  return <Room roomId={roomId} />;
}
