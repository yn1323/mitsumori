import {
  gerRoomCollectionDoc,
  roomCollection,
} from "@/libs/firebase/dataStructure";
import {
  getDocs,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

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

export const resetStoryPoint = async (roomId: string, userid: string) =>
  await setStoryPoint(roomId, userid, -1);

export const resetAllUserStoryPoints = async (roomId: string) => {
  try {
    const roomRef = roomCollection(roomId);
    const q = query(
      roomRef,
      where("type", "==", "userInfo"),
      where("role", "==", "player"),
    );

    const querySnapshot = await getDocs(q);
    const batch = writeBatch(roomRef.firestore);

    for (const doc of querySnapshot.docs) {
      batch.update(doc.ref, { point: -1 });
    }

    await batch.commit();
    return { success: true };
  } catch (error) {
    console.error("Error resetting story points:", error);
    return { success: false };
  }
};
