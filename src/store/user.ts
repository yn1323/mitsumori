import { atom } from "jotai";

type UserState = {
  uid: string;
  role: "player" | "spectator";
  imageType: string;
  isOnline: boolean;
} | null;

export const userAtom = atom<UserState>(null);
