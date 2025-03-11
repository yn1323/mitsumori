"use client";

import { Box, Text } from "@chakra-ui/react";

type Props = {
  number: number;
  selectedNumber: number;
  isCardsOpen: boolean;
  onClick?: () => void;
};

export const SelectableCard = ({
  number,
  selectedNumber,
  isCardsOpen,
  onClick,
}: Props) => {
  return (
    <Box
      bg="white"
      border="1px"
      borderColor="gray.200"
      borderRadius="lg"
      boxShadow="lg"
      aspectRatio="2/3"
      maxW="120px"
      w="full"
      display="flex"
      alignItems="center"
      justifyContent="center"
      cursor={isCardsOpen ? undefined : "pointer"}
      transition="transform 0.2s"
      onClick={isCardsOpen ? undefined : onClick}
      _hover={
        isCardsOpen
          ? undefined
          : {
              transform: "translateY(-4px)",
              boxShadow: "xl",
              bg: "gray.50",
            }
      }
    >
      <Text
        fontSize={{ base: "xl", md: "2xl" }}
        fontWeight="bold"
        color={number === selectedNumber ? "green.500" : undefined}
      >
        {number}
      </Text>
    </Box>
  );
};
