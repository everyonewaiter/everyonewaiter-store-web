import { useEffect } from "react";
import Lottie from "lottie-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import cooking from "@/assets/json/cooking.json";

function SignupLoadingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(`/signup/result?email=${email}`);
    }, 1500);
    return () => clearTimeout(timer);
  }, [email, navigate]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center text-center md:mt-[-20px] md:w-73 lg:w-108">
      <Lottie
        animationData={cooking}
        loop
        autoplay
        height={240}
        width={240}
        className="z-10 -mt-10 size-60 lg:size-90"
        rendererSettings={{
          preserveAspectRatio: "xMidYMid meet",
        }}
      />
      <div className="z-50 -mt-5 mb-10 flex flex-col gap-1 lg:gap-2">
        <p className="text-gray-0 text-lg font-semibold lg:text-2xl">
          가입 절차를 마무리하고 있어요!
        </p>
        <span className="text-sm font-normal text-gray-300 lg:text-lg">잠깐만 기다려주세요.</span>
      </div>
    </div>
  );
}

export default SignupLoadingPage;
