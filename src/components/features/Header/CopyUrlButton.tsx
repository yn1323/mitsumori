"use client";

import { toaster } from "@/components/ui/toaster";
import { Button } from "@chakra-ui/react";
import { usePathname } from "next/navigation";

export const CopyUrlButton = () => {
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  const handleClick = () => {
    const url = window.location.origin + pathname;
    navigator.clipboard.writeText(url);
    toaster.create({
      title: "URLをコピーしました",
      description: "コピーしたURLを共有してください",
      type: "success",
    });
  };

  return (
    <Button size="sm" onClick={handleClick} colorPalette="orange">
      URLをコピー
    </Button>
  );
};
