import Lottie from "lottie-react";
import success from "@/assets/json/success.json";
import Button from "@/components/ui/Button/Button";

function SignupResultPage() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 text-center md:w-[292px] lg:w-[432px] lg:gap-10">
      <Lottie
        animationData={success}
        loop
        autoplay
        height={240}
        width={240}
        className="z-10 -mt-10 size-25 md:size-30 lg:size-40"
        rendererSettings={{
          preserveAspectRatio: "xMidYMid meet",
        }}
      />
      <div className="z-50 flex flex-col gap-1 lg:gap-2">
        <h1 className="text-gray-0 text-lg font-semibold lg:text-2xl">회원가입이 완료되었어요!</h1>
        <span className="hidden text-sm leading-normal font-normal whitespace-pre-line text-gray-300 md:block lg:text-lg">{`이메일 인증을 위해 등록하신 이메일을 확인해 주세요.\n인증을 완료하셔야 서비스 이용이 가능합니다.`}</span>
      </div>
      <Button
        color="grey"
        responsive
        responsiveButtons={{
          lg: {
            buttonSize: "custom",
            className:
              "py-4 text-center bg-gray-700 rounded-xl w-full text-gray-300 text-xl font-medium",
          },
          md: {
            buttonSize: "custom",
            className:
              "py-3 text-center bg-gray-700 rounded-xl w-full text-gray-300 md:text-md lg:text-xl font-medium",
          },
          sm: {
            buttonSize: "xl",
            className: "text-base font-medium text-gray-0 w-full",
          },
        }}
      >
        asdfkjhlkasdjfhl@gmail.com
      </Button>
      <div className="flex flex-col gap-2 text-center md:hidden">
        <span className="text-base font-medium text-[#191919]">
          이메일 인증을 위해 이메일을 발송하였습니다.
        </span>
        <span className="text-sm font-normal text-gray-300">
          메일 수신이 되지 않았다면, 스팸 메일함을 확인해주세요.
        </span>
      </div>
    </div>
  );
}

export default SignupResultPage;
