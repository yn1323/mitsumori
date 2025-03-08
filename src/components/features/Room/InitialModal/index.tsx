import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
import { Radio, RadioGroup } from "@/components/ui/radio";
import { Button, Stack } from "@chakra-ui/react";
import { useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const InitialModal = ({ isOpen, onClose }: Props) => {
  const [userType, setUserType] = useState<"player" | "spectator">("player");

  if (!isOpen) return null;

  return (
    <DialogRoot defaultOpen>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>参加方法の選択</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <RadioGroup value={userType} onChange={(value: "player" | "spectator") => setUserType(value)}>
            <Stack>
              <Radio value="player">プレイヤーとして参加</Radio>
              <Radio value="spectator">観戦者として参加</Radio>
            </Stack>
          </RadioGroup>
        </DialogBody>
        <DialogFooter>
          <Button colorScheme="blue" onClick={onClose}>
            参加する
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};
