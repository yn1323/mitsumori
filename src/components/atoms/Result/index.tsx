import { Box, Text } from "@chakra-ui/react";

type Props = {
  points: number[];
};

export const Result = ({ points }: Props) => {
  const average =
    points.length > 0
      ? points.reduce((sum, point) => sum + point, 0) / points.length
      : 0;

  return (
    <Box p={4} bg="gray.50" borderRadius="md" w="400px">
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        結果
      </Text>
      <Text>平均ポイント: {average.toFixed(1)}</Text>
      <Text fontSize="sm" color="gray.600">
        投票数: {points.length}
      </Text>
    </Box>
  );
};
