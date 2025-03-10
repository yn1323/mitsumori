import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
import { toaster } from "@/components/ui/toaster";
import { gerRoomCollectionDoc } from "@/libs/firebase/dataStructure";
import { Button } from "@chakra-ui/react";
import { updateDoc } from "firebase/firestore";
import { useCallback, useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
  uid: string;
};

export const ForceLogoutModal = ({ isOpen, onClose, roomId, uid }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsLoading(true);

      try {
        const userInfoRef = gerRoomCollectionDoc(roomId, uid);
        await updateDoc(userInfoRef, {
          isOnline: false,
        });
        toaster.create({
          type: "success",
          description: "強制ログアウトに成功しました",
        });
        onClose();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "不明なエラーが発生しました";
        toaster.create({
          type: "error",
          description: `強制ログアウトに失敗しました。\n${errorMessage}`,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [roomId, uid, onClose],
  );

  if (!isOpen) return null;

  return (
    <DialogRoot defaultOpen placement="center">
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>強制ログアウト</DialogTitle>
          </DialogHeader>
          <DialogBody>このユーザーを強制的にログアウトさせますか？</DialogBody>
          <DialogFooter>
            <Button onClick={onClose}>キャンセル</Button>
            <Button
              colorScheme="red"
              type="submit"
              ml={3}
              loading={isLoading}
              loadingText="追放中"
            >
              強制ログアウト
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </DialogRoot>
  );
};
