import "client-only";

import { toaster } from "@/components/ui/toaster";
import {
  type UserDocType,
  roomCollection,
} from "@/libs/firebase/dataStructure";
import { userAtom } from "@/store/user";
import { onSnapshot, query, where } from "firebase/firestore";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export const watchOnlineMembers = (
  roomId: string,
  callback: Dispatch<SetStateAction<UserDocType[]>>,
) => {
  const membersRef = roomCollection(roomId);
  const membersQuery = query(membersRef, where("isOnline", "==", true));

  return onSnapshot(membersQuery, (snapshot) => {
    const onlineMembers = snapshot.docs
      .map((d) => d.data() as UserDocType)
      .filter(({ isOnline }) => isOnline);

    callback(onlineMembers);
  });
};

export const useWatchOnlineMembers = (roomId: string) => {
  const [onlineMembers, setOnlineMembers] = useState<UserDocType[]>([]);
  const [user, setUser] = useAtom(userAtom);
  const router = useRouter();
  const prevIsOnline = useRef(false);

  useEffect(() => {
    const unsubscribe = watchOnlineMembers(roomId, setOnlineMembers);
    return () => unsubscribe();
  }, [roomId]);

  useEffect(() => {
    const selfInfo = onlineMembers.find(({ uid }) => uid === user.uid);
    if (selfInfo) {
      setUser(selfInfo);
      prevIsOnline.current = selfInfo.isOnline;
    }

    // 強制ログアウト時は遷移
    if (!selfInfo && prevIsOnline.current) {
      toaster.create({
        type: "error",
        description: "強制ログアウトさせられました",
      });
      router.push("/");
    }
  }, [onlineMembers, user.uid, setUser, router.push]);

  const players = onlineMembers.filter(({ role }) => role === "player");
  const spectators = onlineMembers.filter(({ role }) => role === "spectator");

  const overDiffUserUIds = useMemo(() => {
    const points = players.map(({ point }) => point).filter((p) => p >= 0);
    const uniquePoints = [...new Set(points)];
    if (uniquePoints.length <= 3) {
      return [];
    }
    const max = Math.max(...uniquePoints);
    const min = Math.min(...uniquePoints);

    return players
      .filter(({ point }) => point === min || point === max)
      .map(({ uid }) => uid);
  }, [players]);

  return {
    all: onlineMembers,
    players,
    spectators,
    overDiffUserUIds,
  };
};
