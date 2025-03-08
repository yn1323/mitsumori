import { CreateRoom } from "@/components/features/CreateRoom";
import { VStack } from "@chakra-ui/react";

export default function Home() {
  return (
    <main>
      <VStack minH="100vh" justify="center" align="center">
        <CreateRoom />
      </VStack>
    </main>
  );
}
