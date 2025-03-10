import { gerRoomCollectionDoc } from "@/libs/firebase/dataStructure";
import { updateDoc } from "firebase/firestore";

export const setCardsOpen = async (roomId: string) => {
  const docRef = gerRoomCollectionDoc(roomId, roomId);

  try {
    await updateDoc(docRef, {
      isCardsOpen: true,
    });
  } catch {
    return { success: false };
  }

  return { success: true };
};

export const setCardsClose = async (roomId: string) => {
  const docRef = gerRoomCollectionDoc(roomId, roomId);

  try {
    await updateDoc(docRef, {
      isCardsOpen: false,
    });
  } catch {
    return { success: false };
  }

  return { success: true };
};
