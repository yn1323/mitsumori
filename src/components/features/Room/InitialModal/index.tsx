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

import { Button } from "@chakra-ui/react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const InitialModal = ({ isOpen, onClose }: Props) => {
  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const value = formData.get("role") as "player" | "spectator";
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
                  label="プレイヤー"
                  description="プランニングポーカーで見積もりを行います。"
                  key="player"
                  value="player"
                />
                <RadioCardItem
                  label="観戦者"
                  description="他の参加者の見積もりを見ることができます。野次もOK。"
                  key="spectator"
                  value="spectator"
                />
              </RadioCardRoot>
            </RadioGroup>
          </DialogBody>
          <DialogFooter>
            <Button type="submit" colorScheme="blue">
              参加する
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </DialogRoot>
  );
};
