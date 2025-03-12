import {
  type EmotionDocType,
  gerRoomCollectionDoc,
  roomCollection,
} from "@/libs/firebase/dataStructure";
import { doc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

export const setEmoji = async (roomId: string, uid: string, emoji: string) => {
  const uuid = uuidv4();
  const docRef = gerRoomCollectionDoc(roomId, uuid);

  const roomRef = doc(roomCollection(roomId), docRef.id);
  await setDoc(roomRef, {
    emoji,
    uid,
    type: "emotion",
    uuid,
  } satisfies EmotionDocType);

  return { success: true };
};
