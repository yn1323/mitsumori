"use client";

import { addDoc, collection } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { firestore } from "@/src/lib/firebase";

import "@/app/index.css";

export const Home = () => {
  const router = useRouter();

  const handleCreateRoom = async () => {
    const roomId = uuidv4();
    const roomRef = collection(firestore, "mitsumori", "room", roomId);
    await addDoc(roomRef, {
      createdAt: new Date(),
    });

    router.push(`/room/${roomId}`);
  };

  return (
    <main className="container mx-auto p-4 flex items-center justify-center min-h-screen">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>見積もりルーム作成</CardTitle>
          <CardDescription>
            新しい見積もりルームを作成して、チームでプランニングポーカーを始めましょう。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" onClick={handleCreateRoom}>
            ルームを作成
          </Button>
        </CardContent>
      </Card>
    </main>
  );
};
