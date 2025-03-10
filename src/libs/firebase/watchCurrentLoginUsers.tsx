import "client-only";

import {
  type UserDocType,
  roomCollection,
} from "@/libs/firebase/dataStructure";
import { userAtom } from "@/store/user";
import { onSnapshot, query, where } from "firebase/firestore";
import { useAtom } from "jotai";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

export const watchOnlineMembers = (
  roomId: string,
  callback: Dispatch<SetStateAction<UserDocType[]>>,
) => {
  const membersRef = roomCollection(roomId);
  const membersQuery = query(membersRef, where("isOnline", "==", true));

  return onSnapshot(membersQuery, (snapshot) => {
    const onlineMembers = snapshot.docs
      .map((d) => d.data() as UserDocType)
      .filter(({ isOnline }) => isOnline);

    callback(onlineMembers);
  });
};

export const useWatchOnlineMembers = (roomId: string) => {
  const [onlineMembers, setOnlineMembers] = useState<UserDocType[]>([]);
  const [user, setUser] = useAtom(userAtom);

  useEffect(() => {
    const unsubscribe = watchOnlineMembers(roomId, setOnlineMembers);
    return () => unsubscribe();
  }, [roomId]);

  useEffect(() => {
    const selfInfo = onlineMembers.find(({ uid }) => uid === user.uid);
    selfInfo && setUser(selfInfo);
  }, [onlineMembers, user.uid, setUser]);

  return {
    all: onlineMembers,
    players: onlineMembers.filter(({ role }) => role === "player"),
    spectators: onlineMembers.filter(({ role }) => role === "spectator"),
  };
};
