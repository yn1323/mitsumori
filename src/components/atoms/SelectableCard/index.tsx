"use client";

import { Box, Text } from "@chakra-ui/react";

type Props = {
  number: number;
  onClick?: () => void;
};

export const SelectableCard = ({ number, onClick }: Props) => {
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
      cursor="pointer"
      transition="transform 0.2s"
      onClick={onClick}
      _hover={{
        transform: "translateY(-4px)",
        boxShadow: "xl",
        bg: "gray.50",
      }}
    >
      <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold">
        {number}
      </Text>
    </Box>
  );
};
