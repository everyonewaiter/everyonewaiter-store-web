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
        style={{
          width: status === "initial" ? "160px" : "200px",
          height: status === "initial" ? "160px" : "200px",
        }}
      />
      <div className={cn("flex w-full flex-col gap-8", status !== "initial" && "-mt-10")}>
        <div className="flex flex-col gap-3 text-center">
          <h1 className="text-gray-0 text-2xl font-semibold whitespace-pre-line">{title}</h1>
          <p className="text-lg font-normal whitespace-pre-line text-gray-300">{description}</p>
        </div>
        <Button
          responsive
          responsiveButtons={{
            lg: { buttonSize: "lg" },
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
