import Image from "next/image";
import React from "react";
import { useMediaMatch } from "../hooks/isMobile";
import loadingArt from "../resources/images/LoadingContent.svg";

export default function LoadingContent() {
  const isMobile = useMediaMatch();
  return (
    <Image
      width={isMobile ? 330 : 500}
      src={loadingArt}
      alt="loading-content-art"
    />
  );
}
