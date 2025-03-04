"use client";

import { useParams } from "next/navigation";

const Page = () => {
  const params = useParams();
  const roomId = params.id as string;

  return (
    <div>
      Room ID: {roomId}
    </div>
  );
};

export default Page