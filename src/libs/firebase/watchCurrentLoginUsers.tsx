"use client";

import { db } from "@/libs/firebase";
import { collection, onSnapshot, query } from "firebase/firestore";
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
  const membersQuery = query(
    collection(db, "mitsumori", "room", roomId, "members"),
  );

  return onSnapshot(membersQuery, (snapshot) => {
    const onlineMembers: { [key: string]: MemberInfo } = {};

    for (const doc of snapshot.docs) {
      const infoDoc = doc.data();
      if (infoDoc.info?.isOnline) {
        onlineMembers[doc.id] = infoDoc.info as MemberInfo;
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
    const unsubscribe = watchCurrentLoginUsers(roomId, (members) => {
      setOnlineMembers(members);
    });

    return () => {
      unsubscribe();
    };
  }, [roomId]);

  return onlineMembers;
};
