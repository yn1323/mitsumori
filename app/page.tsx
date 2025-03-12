"use client";

import { CreateRoom } from "@/components/features/CreateRoom";
import {
  Box,
  Container,
  Flex,
  Grid,
  Heading,
  Icon,
  Text,
  VStack,
} from "@chakra-ui/react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
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
      bg="whiteAlpha.500"
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
    <VStack gap="2" align="center" textAlign="center" bg="whiteAlpha.500">
      <Icon as={icon} boxSize={8} color="green.400" />
      <Text fontWeight="bold">{title}</Text>
      <Text fontSize="sm" color="gray.500">
        {description}
      </Text>
    </VStack>
  );
};

const FloatingImage = () => {
  const [position, setPosition] = useState(() => ({
    x:
      Math.random() *
      (typeof window !== "undefined" ? window.innerWidth - 100 : 500),
    y:
      Math.random() *
      (typeof window !== "undefined" ? window.innerHeight - 100 : 500),
  }));
  const [velocity, setVelocity] = useState(() => ({
    x: (Math.random() - 0.5) * 2,
    y: (Math.random() - 0.5) * 2,
  }));
  const [imageNumber] = useState(() => Math.floor(Math.random() * 10));

  const animate = useCallback(() => {
    setPosition((prev) => {
      setVelocity((currentVel) => {
        const nextX = prev.x + currentVel.x;
        const nextY = prev.y + currentVel.y;
        let newVelX = currentVel.x;
        let newVelY = currentVel.y;

        if (nextX <= 0 || nextX >= window.innerWidth - 50) {
          newVelX = -currentVel.x;
        }
        if (nextY <= 0 || nextY >= window.innerHeight - 50) {
          newVelY = -currentVel.y;
        }

        return newVelX !== currentVel.x || newVelY !== currentVel.y
          ? { x: newVelX, y: newVelY }
          : currentVel;
      });

      return {
        x: Math.max(0, Math.min(window.innerWidth - 50, prev.x + velocity.x)),
        y: Math.max(0, Math.min(window.innerHeight - 50, prev.y + velocity.y)),
      };
    });
  }, [velocity.x, velocity.y]);

  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => ({
        x: Math.min(prev.x, window.innerWidth - 50),
        y: Math.min(prev.y, window.innerHeight - 50),
      }));
    };

    window.addEventListener("resize", handleResize);

    let animationId: number;
    const updateFrame = () => {
      animate();
      animationId = requestAnimationFrame(updateFrame);
    };
    animationId = requestAnimationFrame(updateFrame);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [animate]);

  return (
    <Box
      position="absolute"
      left={position.x}
      top={position.y}
      width="50px"
      height="50px"
      opacity={0.4}
      transition="none"
      pointerEvents="none"
    >
      <Image
        src={`/img/${imageNumber}.svg`}
        alt="floating number"
        width={50}
        height={50}
      />
    </Box>
  );
};

export default function Home() {
  const [floatingImages] = useState(() =>
    Array.from({ length: 10 }, (_, i) => i),
  );

  return (
    <main style={{ position: "relative", overflow: "hidden" }}>
      {floatingImages.map((i) => (
        <FloatingImage key={i} />
      ))}
      <Container maxW="container.xl" h="calc(100vh - 64px)">
        <Grid
          templateRows="auto auto auto auto"
          gap={10}
          h="full"
          py={12}
          alignContent="center"
        >
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
          <Flex justify="center" w="full" py={6}>
            <CreateRoom />
          </Flex>

          {/* 主要機能 */}
          <Grid
            templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
            gap={6}
            maxW="4xl"
            mx="auto"
            w="full"
          >
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
          <Flex
            justify="space-around"
            wrap="wrap"
            gap={8}
            maxW="4xl"
            mx="auto"
            w="full"
          >
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
