import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup } from "@/components/ui/radio";
import { RadioCardItem, RadioCardRoot } from "@/components/ui/radio-card";
import { toaster } from "@/components/ui/toaster";
import { auth } from "@/libs/firebase";
import {
  type UserDocType,
  gerRoomCollectionDoc,
} from "@/libs/firebase/dataStructure";
import { defaultUserAtom, userAtom } from "@/store/user";
import { Button } from "@chakra-ui/react";
import { setDoc } from "firebase/firestore";
import { useSetAtom } from "jotai";
import { useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
};

export const InitialModal = ({ isOpen, onClose, roomId }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const setUser = useSetAtom(userAtom);
  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const value = formData.get("role") as "player" | "spectator";

      const uid = auth.currentUser?.uid;

      if (!uid) {
        throw new Error("ユーザーが認証されていません");
      }

      if (!["player", "spectator"].includes(value)) {
        toaster.create({
          type: "error",
          description: "参加方式を選んでください",
        });
        setIsLoading(false);
        return;
      }

      const memberInfoRef = gerRoomCollectionDoc(roomId, uid);
      const imageType = Math.floor(Math.random() * 10).toString();
      const doc: UserDocType = {
        ...defaultUserAtom,
        uid,
        role: value,
        isOnline: true,
        imageType,
        joinedAt: new Date(),
      };
      await setDoc(memberInfoRef, doc);
      setUser(doc);

      onClose();
      toaster.create({
        type: "success",
        description:
          value === "player"
            ? "プレイヤーとして参加しました"
            : "観戦者として参加しました",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "不明なエラーが発生しました";
      toaster.create({
        type: "error",
        description: `参加処理に失敗しました。\n${errorMessage}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DialogRoot
      defaultOpen
      closeOnEscape={false}
      closeOnInteractOutside={false}
      placement="center"
    >
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>参加方法の選択</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <RadioGroup>
              <RadioCardRoot name="role">
                <RadioCardItem
                  colorPalette="orange"
                  label="プレイヤー"
                  description="プランニングポーカーで見積もりを行います。"
                  key="player"
                  value="player"
                />
                <RadioCardItem
                  colorPalette="orange"
                  label="観戦者"
                  description="他の参加者の見積もりを見ることができます。野次もOK。"
                  key="spectator"
                  value="spectator"
                />
              </RadioCardRoot>
            </RadioGroup>
          </DialogBody>
          <DialogFooter>
            <Button
              type="submit"
              colorScheme="blue"
              loading={isLoading}
              loadingText="参加中"
              colorPalette="orange"
            >
              参加する
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </DialogRoot>
  );
};
