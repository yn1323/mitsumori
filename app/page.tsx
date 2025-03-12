"use client";

import { CreateRoom } from "@/components/features/CreateRoom";
import {
  Container,
  Flex,
  Grid,
  Heading,
  Icon,
  Text,
  VStack,
} from "@chakra-ui/react";
import type { IconType } from "react-icons";
import {
  FaCheckCircle,
  FaPlus,
  FaRegSmile,
  FaSync,
  FaUserFriends,
  FaUsers,
} from "react-icons/fa";

type FeatureProps = {
  icon: IconType;
  title: string;
  description: string;
};

const Feature = ({ icon, title, description }: FeatureProps) => {
  return (
    <VStack
      gap="3"
      p={4}
      bg="whiteAlpha.200"
      borderRadius="lg"
      align="start"
      h="full"
    >
      <Icon as={icon} boxSize={6} color="blue.400" />
      <Text fontWeight="bold" fontSize="lg">
        {title}
      </Text>
      <Text>{description}</Text>
    </VStack>
  );
};

type StepProps = {
  icon: IconType;
  title: string;
  description: string;
};

const Step = ({ icon, title, description }: StepProps) => {
  return (
    <VStack gap="2" align="center" textAlign="center">
      <Icon as={icon} boxSize={8} color="green.400" />
      <Text fontWeight="bold">{title}</Text>
      <Text fontSize="sm" color="gray.500">
        {description}
      </Text>
    </VStack>
  );
};

export default function Home() {
  return (
    <main>
      <Container maxW="container.xl" h="calc(100vh - 64px)">
        <Grid templateRows="auto auto 1fr auto" gap={8} h="full" py={8}>
          {/* ヘッドライン */}
          <VStack gap="4" textAlign="center">
            <Heading
              as="h1"
              size="2xl"
              bgGradient="linear(to-r, blue.400, purple.500)"
              bgClip="text"
            >
              プランニングポーカーを
              <br />
              もっと楽しく、シンプルに
            </Heading>
            <Text fontSize="xl" color="gray.500">
              チームの見積もりをリアルタイムで共有。観客モードで気軽に参加できます。
            </Text>
          </VStack>

          {/* ルーム作成 - 中央に配置 */}
          <Flex justify="center" w="full" py={4}>
            <CreateRoom />
          </Flex>

          {/* 主要機能 */}
          <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6}>
            <Feature
              icon={FaSync}
              title="リアルタイム同期"
              description="Firestoreで即座にデータを同期。チームの意思決定をスムーズに。"
            />
            <Feature
              icon={FaUsers}
              title="観客モード"
              description="見学者はポーカーに影響を与えずに、プロセスを観察できます。"
            />
            <Feature
              icon={FaRegSmile}
              title="絵文字リアクション"
              description="カードめくりの瞬間を絵文字で盛り上げましょう。"
            />
          </Grid>

          {/* 使い方ステップ */}
          <Flex justify="space-around" wrap="wrap" gap={4}>
            <Step
              icon={FaPlus}
              title="ルームを作成"
              description="見積もり対象の課題名を入力"
            />
            <Step
              icon={FaUserFriends}
              title="メンバーを招待"
              description="URLをシェアしてチームに共有"
            />
            <Step
              icon={FaCheckCircle}
              title="見積もりスタート"
              description="全員の準備が整ったらカードめくり"
            />
          </Flex>
        </Grid>
      </Container>
    </main>
  );
}
