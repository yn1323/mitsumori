import "client-only";

import { db } from "@/libs/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

export type MemberInfo = {
  isOnline: boolean;
  name: string;
  role: "player" | "spectator";
};

export const watchCurrentLoginUsers = (
  roomId: string,
  callback: (members: { [key: string]: MemberInfo }) => void,
) => {
  const membersRef = collection(db, "mitsumori", "room", roomId, "members");
  const membersQuery = query(membersRef, where("info.isOnline", "==", true));

  return onSnapshot(membersQuery, (snapshot) => {
    const onlineMembers: { [key: string]: MemberInfo } = {};

    for (const doc of snapshot.docs) {
      const data = doc.data();
      if (data.info) {
        onlineMembers[doc.id] = data.info;
      }
    }

    callback(onlineMembers);
  });
};

export const useOnlineMembers = (roomId: string) => {
  const [onlineMembers, setOnlineMembers] = useState<
    Record<string, MemberInfo>
  >({});

  useEffect(() => {
    const unsubscribe = watchCurrentLoginUsers(roomId, setOnlineMembers);
    return () => unsubscribe();
  }, [roomId]);

  return onlineMembers;
};
