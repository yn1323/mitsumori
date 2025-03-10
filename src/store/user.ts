import type { UserDocType } from "@/libs/firebase/dataStructure";
import { atom } from "jotai";

export const defaultUserAtom: UserDocType = {
  type: "userInfo",
  uid: "",
  role: "player",
  imageType: "0",
  point: -1,
  isOnline: false,
  joinedAt: new Date(),
};

export const userAtom = atom<UserDocType>(defaultUserAtom);
