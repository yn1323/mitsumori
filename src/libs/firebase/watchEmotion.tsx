import {
  type EmotionDocType,
  roomCollection,
} from "@/libs/firebase/dataStructure";
import { onSnapshot, query, where } from "firebase/firestore";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

const watchEmotion = (
  roomId: string,
  callback: Dispatch<SetStateAction<EmotionDocType[]>>,
) => {
  const membersRef = roomCollection(roomId);
  const membersQuery = query(membersRef, where("type", "==", "emotion"));

  return onSnapshot(membersQuery, (snapshot) => {
    const addedEmotions = snapshot
      .docChanges()
      .filter((change) => change.type === "added")
      .map((change) => change.doc.data() as EmotionDocType);

    if (addedEmotions.length > 0) {
      callback(() => addedEmotions);
    }
  });
};
export const useEmotion = (roomId: string) => {
  const [emotions, setEmotions] = useState<EmotionDocType[]>([]);

  useEffect(() => {
    const unsubscribe = watchEmotion(roomId, setEmotions);
    return () => unsubscribe();
  }, [roomId]);

  return {
    emotions,
  };
};
