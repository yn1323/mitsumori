
import { VStack } from "@chakra-ui/react";
import { CreateRoom } from "@/components/features/CreateRoom";

export default function Home() {
  return (
    <main>
      <VStack minH="100vh" justify="center" align="center">
        <CreateRoom />
      </VStack>
    </main>
  );
}
