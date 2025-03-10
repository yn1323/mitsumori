"use client";

import { CloseButton } from "@/components/ui/close-button";
import { auth } from "@/libs/firebase";
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

const YouIndicator = () => (
  <Box textAlign="center" mt={1}>
    <Text color="gray.500" fontSize="lg" fontWeight="bold" lineHeight={1}>
      ▲
    </Text>
    <Text fontSize="sm" fontWeight="bold" color="gray.500">
      YOU
    </Text>
  </Box>
);

export const PlayerCard = ({
  uid,
  status,
  selectedNumber,
  diff = false,
  onClickUnselected,
  onClickSelected,
}: Props) => {
  const isMyCard = (auth.currentUser?.uid ?? "") === uid;
  const baseProps = {
    bg: "white",
    border: "2px",
    borderRadius: "lg",
    aspectRatio: "2/3",
    maxW: "120px",
    w: "full",
  };

  const renderCardContent = () => {
    switch (status) {
      case "unselected":
        return {
          cardProps: {
            borderColor: "gray.200",
            boxShadow: "sm",
            cursor: isMyCard ? undefined : "pointer",
            onClick: isMyCard ? undefined : onClickUnselected,
            transition: "all 0.2s",
            _hover: isMyCard
              ? undefined
              : {
                  transform: "translateY(-2px)",
                  boxShadow: "md",
                  bg: "gray.50",
                  borderColor: "gray.300",
                },
            _active: {
              transform: "translateY(0)",
            },
          },
          content: (
            <Box
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
            >
              <Text color="gray.400" fontSize="sm" fontWeight="bold">
                考え中...
              </Text>
            </Box>
          ),
        };
      case "selected":
        return {
          cardProps: {
            onClick: isMyCard ? onClickSelected : undefined,
            bg: "blue.500",
            borderColor: "blue.400",
            boxShadow: "lg",
            cursor: isMyCard ? "pointer" : undefined,
            transition: "all 0.2s",
            _hover: isMyCard
              ? {
                  transform: "translateY(-4px)",
                  boxShadow: "xl",
                  bg: "blue.600",
                  "& > .close-button": {
                    opacity: 1,
                  },
                }
              : undefined,
            _after: {
              content: '""',
              position: "absolute",
              top: "10px",
              left: "10px",
              right: "10px",
              bottom: "10px",
              border: "2px solid",
              borderColor: "blue.300",
              borderRadius: "md",
            },
          },
          content: (
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
          ),
        };
      case "opened":
        return {
          cardProps: {
            borderColor: "green.500",
            boxShadow: "lg",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
          content: (
            <Text
              fontSize="4xl"
              fontWeight="bold"
              color={diff ? "red.500" : "green.500"}
            >
              {selectedNumber}
            </Text>
          ),
        };
    }
  };

  const { cardProps, content } = renderCardContent();

  return (
    <Box
      position="relative"
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Box {...baseProps} {...cardProps} position="relative">
        {content}
      </Box>
      {isMyCard && <YouIndicator />}
    </Box>
  );
};
