import "client-only";

import {
  type UserDocType,
  roomCollection,
} from "@/libs/firebase/dataStructure";
import { onSnapshot, query, where } from "firebase/firestore";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

export const watchCurrentLoginUsers = (
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

export const useOnlineMembers = (roomId: string) => {
  const [onlineMembers, setOnlineMembers] = useState<UserDocType[]>([]);

  useEffect(() => {
    const unsubscribe = watchCurrentLoginUsers(roomId, setOnlineMembers);
    return () => unsubscribe();
  }, [roomId]);

  return onlineMembers;
};
