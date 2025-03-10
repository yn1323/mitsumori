import type { UserDocType } from "@/libs/firebase/dataStructure";
import { atom } from "jotai";

export const userAtom = atom<UserDocType>({
  type: "userInfo",
  uid: "",
  role: "player",
  imageType: "0",
  isOnline: false,
  joinedAt: new Date(),
});
