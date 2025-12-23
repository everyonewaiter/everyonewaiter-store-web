import { useEffect } from "react";
import Lottie from "lottie-react";

import riceWhite from "@/assets/json/rice-white.json";

export default function Loading() {
  const isLottieSupported = typeof window !== "undefined";

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60">
      <div className="flex h-dvh w-dvw flex-col items-center justify-center gap-3">
        {isLottieSupported ? <Lottie
          animationData={riceWhite}
          loop={true}
          autoplay={true}
          rendererSettings={{
            preserveAspectRatio: "xMidYMid slice",
          }}
          height={120}
          width={120}
        /> : <img
          src="/images/loading-replace.svg"
          alt="Loading animation"
          width={120}
          height={120}
        />}
        <div className="flex flex-col items-center">
          <span className="text-[15px] text-white">
            서비스를 불러오고 있어요.
          </span>
          <span className="text-[15px] text-white">
            잠시만 기다려 주세요.
          </span>
        </div>
      </div>
    </div>
  );
}
