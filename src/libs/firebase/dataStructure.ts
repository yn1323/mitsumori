import { db } from "@/libs/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export const roomCollection = (roomId: string) =>
  collection(db, "mitsumori", "room", roomId);

export const getRoomInfo = async (roomId: string) => {
  const roomRef = roomCollection(roomId);
  const q = query(roomRef, where("type", "==", "roomInfo"));

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs[0];
};
