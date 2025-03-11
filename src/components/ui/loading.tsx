import { ProgressCircle } from "@chakra-ui/react";

export const Loading = () => (
  <ProgressCircle.Root value={null} colorPalette="teal">
    <ProgressCircle.Circle>
      <ProgressCircle.Track />
      <ProgressCircle.Range />
    </ProgressCircle.Circle>
  </ProgressCircle.Root>
);
