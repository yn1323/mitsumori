import { Box, Button, HStack, Text } from "@chakra-ui/react";

type Props = {
  onClick: (emoji: string) => void;
};

export const EmoButtons = ({ onClick }: Props) => {
  const emojis = ["👍", "👏", "🎉", "🤔", "😊", "😢", "💩"];

  return (
    <Box
      position="fixed"
      top={2}
      left="50%"
      transform="translateX(-50%)"
      zIndex={1000}
      bg="whiteAlpha.900"
      _dark={{ bg: "blackAlpha.800" }}
      borderRadius="full"
      boxShadow="xs"
      py={2}
      px={4}
    >
      <HStack gap={2}>
        {emojis.map((emoji) => (
          <Button
            key={emoji}
            onClick={() => onClick(emoji)}
            variant="ghost"
            size="xs"
            borderRadius="full"
            _hover={{ bg: "gray.100" }}
            _dark={{ _hover: { bg: "whiteAlpha.200" } }}
          >
            <Text fontSize="xl">{emoji}</Text>
          </Button>
        ))}
      </HStack>
    </Box>
  );
};
