import Lottie, { type LottieComponentProps } from "lottie-react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button/Button";
import cn from "@/lib/utils";

interface GuestContentProps {
  status: "initial" | "pending" | "rejected";
  title: string;
  description: string;
  animationData: LottieComponentProps["animationData"];
}

function GuestContent({ status, title, description, animationData }: Readonly<GuestContentProps>) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    if (status === "initial") {
      navigate("/guest/create");
    } else {
      navigate("/guest/application");
    }
  };

  return (
    <>
      <Lottie
        animationData={animationData}
        loop
        autoplay
        rendererSettings={{
          preserveAspectRatio: "xMidYMid slice",
        }}
        className={cn(status === "initial" ? "size-30 md:size-25 lg:size-40" : "size-30")}
      />
      <div
        className={cn(
          "flex w-full flex-col gap-6 lg:gap-10",
          status !== "initial" && "-mt-8 lg:-mt-10"
        )}
      >
        <div className="flex flex-col gap-3 text-center md:gap-2 lg:gap-3">
          <h1 className="text-gray-0 text-lg font-semibold whitespace-pre-line md:text-base lg:text-2xl">
            {title}
          </h1>
          <p className="text-s font-normal whitespace-pre-line text-gray-300 lg:text-lg">
            {description}
          </p>
        </div>
        <Button
          responsive
          responsiveButtons={{
            lg: { buttonSize: "lg" },
            md: { buttonSize: "sm" },
            sm: { buttonSize: "md", className: "!h-10" },
          }}
          onClick={handleNavigate}
        >
          {status === "initial" ? "매장 등록하기" : "내 신청 현황 보기"}
        </Button>
      </div>
    </>
  );
}

export default GuestContent;
