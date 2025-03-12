import { db } from "@/libs/firebase";
import {
  type Timestamp,
  collection,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

export type RoomDocType = {
  createdAt: Timestamp | Date;
  roomId: string;
  type: "roomInfo";
  isCardsOpen: boolean;
};

export type UserDocType = {
  type: "userInfo";
  imageType: string;
  isOnline: boolean;
  point: number;
  joinedAt: Timestamp | Date;
  role: "player" | "spectator";
  uid: string;
};

export type EmotionDocType = {
  type: string;
  uid: string;
  emoji: string;
  uuid: string;
};

export const roomCollection = (roomId: string) =>
  collection(db, "mitsumori", "room", roomId);

export const gerRoomCollectionDoc = (roomId: string, docId: string) => {
  const ref = doc(roomCollection(roomId), docId);

  return ref;
};

export const getRoomInfo = async (roomId: string) => {
  const roomRef = roomCollection(roomId);
  const q = query(roomRef, where("type", "==", "roomInfo"));

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs[0].data() as unknown as RoomDocType;
};

export const getUser = async (roomId: string) => {
  const roomRef = roomCollection(roomId);
  const q = query(roomRef, where("type", "==", "userInfo"));

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs[0].data() as unknown as UserDocType;
};
