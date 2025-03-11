import { Room } from "@/components/features/Room";
import { getRoomInfo } from "@/libs/firebase/dataStructure";
import { notFound } from "next/navigation";

type Params = Promise<{ roomId: string }>;

export default async function RoomPage({ params }: { params: Params }) {
  const { roomId } = await params;
  const roomData = await getRoomInfo(roomId);

  if (!roomData) {
    notFound();
  }

  const createdAt =
    "toDate" in roomData.createdAt
      ? roomData.createdAt.toDate()
      : roomData.createdAt;

  // 1ヶ月前の日付を計算
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  // createdAtが1ヶ月以上前の場合は404
  if (createdAt < oneMonthAgo) {
    notFound();
  }

  return <Room roomId={roomId} />;
}
