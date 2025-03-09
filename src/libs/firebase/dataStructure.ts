import { db } from "@/libs/firebase";
import { collection, doc } from "firebase/firestore";

const roomCollection = (roomId: string) =>
  collection(db, "mitsumori", "room", roomId);

const memberCollection = (roomId: string, uid: string) =>
  collection(roomCollection(roomId), "members", uid);

export const getRoomInfoRef = (roomId: string) =>
  doc(roomCollection(roomId), "roomInfo");

export const getMembersRef = (roomId: string) =>
  doc(roomCollection(roomId), "members");

export const getMembersInfoRef = (roomId: string, uid: string) =>
  doc(memberCollection(roomId, uid), "info");
