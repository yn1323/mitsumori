import "client-only";

import {
  type RoomDocType,
  roomCollection,
} from "@/libs/firebase/dataStructure";
import { onSnapshot, query, where } from "firebase/firestore";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

export const watchRoom = (
  roomId: string,
  callback: Dispatch<SetStateAction<RoomDocType>>,
) => {
  const roomRef = roomCollection(roomId);
  const roomQuery = query(roomRef, where("type", "==", "roomInfo"));

  return onSnapshot(roomQuery, (snapshot) => {
    const room = snapshot.docs.map((d) => d.data() as RoomDocType);
    callback(room[0]);
  });
};

export const useWatchRoom = (roomId: string) => {
  const [state, setState] = useState<RoomDocType>({} as RoomDocType);

  useEffect(() => {
    const unsubscribe = watchRoom(roomId, setState);
    return () => unsubscribe();
  }, [roomId]);

  return state;
};
