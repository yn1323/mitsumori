"use client";

import { CloseButton } from "@/components/ui/close-button";
import { Box, Text } from "@chakra-ui/react";

export type PlayerCardStatus = "unselected" | "selected" | "opened";

type Props = {
  uid: string;
  status: PlayerCardStatus;
  selectedNumber?: number;
  diff?: boolean;
  onClickUnselected?: () => void;
  onClickSelected?: () => void;
};

export const PlayerCard = ({
  status,
  selectedNumber,
  diff = false,
  onClickUnselected,
  onClickSelected,
}: Props) => {
  const baseProps = {
    bg: "white",
    border: "2px",
    borderRadius: "lg",
    aspectRatio: "2/3",
    maxW: "120px",
    w: "full",
  };

  switch (status) {
    case "unselected":
      return <Box {...baseProps} borderColor="gray.200" boxShadow="sm" />;
    case "selected":
      return (
        <Box
          {...baseProps}
          bg="blue.500"
          borderColor="blue.400"
          boxShadow="lg"
          position="relative"
          transition="all 0.2s"
          cursor="pointer"
          _hover={{
            transform: "translateY(-4px)",
            boxShadow: "xl",
            bg: "blue.600",
            "& > .close-button": {
              opacity: 1,
            },
          }}
          _after={{
            content: '""',
            position: "absolute",
            top: "10px",
            left: "10px",
            right: "10px",
            bottom: "10px",
            border: "2px solid",
            borderColor: "blue.300",
            borderRadius: "md",
          }}
        >
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            opacity={0}
            transition="opacity 0.2s"
            className="close-button"
          >
            <CloseButton size="sm" color="white" />
          </Box>
        </Box>
      );
    case "opened":
      return (
        <Box
          {...baseProps}
          borderColor="green.500"
          boxShadow="lg"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text
            fontSize="4xl"
            fontWeight="bold"
            color={diff ? "red.500" : "green.500"}
          >
            {selectedNumber}
          </Text>
        </Box>
      );
  }
};
