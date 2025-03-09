"use client";

import { Box, Text } from "@chakra-ui/react";

export type PlayerCardStatus = "unselected" | "selected" | "opened";

type Props = {
  status: PlayerCardStatus;
  selectedNumber?: number;
  diff?: boolean;
};

export const PlayerCard = ({ status, selectedNumber, diff = false }: Props) => {
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
        />
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
          <Text fontSize="4xl" fontWeight="bold" color={diff ? "red.500" : "green.500"}>
            {selectedNumber}
          </Text>
        </Box>
      );
  }
};
