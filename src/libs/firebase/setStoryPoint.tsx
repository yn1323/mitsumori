import { gerRoomCollectionDoc } from "@/libs/firebase/dataStructure";
import { updateDoc } from "firebase/firestore";

export const setStoryPoint = async (
  roomId: string,
  userId: string,
  storyPoint: number,
) => {
  const docRef = gerRoomCollectionDoc(roomId, userId);

  try {
    await updateDoc(docRef, {
      point: storyPoint,
    });
  } catch {
    return { success: false };
  }

  return { success: true };
};

export const resetAllUserStoryPoints = async (
  roomId: string,
  userId: string,
) => {
  const docRef = gerRoomCollectionDoc(roomId, userId);

  try {
    await updateDoc(docRef, {
      point: -1,
    });
  } catch {
    return { success: false };
  }

  return { success: true };
};
