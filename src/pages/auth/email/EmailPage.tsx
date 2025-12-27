import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import emailHourglass from "@/assets/images/email-hourglass.svg";
import Button from "@/components/ui/Button/Button";

function EmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [isExpired] = useState(false);

  useEffect(() => {
    // TODO: token이 있을 경우 verifyEmail(token) 호출
    // if (!token) return;
  }, [token, navigate]);

  if (token && !isExpired) {
    // TODO: 성공 시 login으로 이동
    return null;
  }

  const content = isExpired
    ? {
        title: "이메일 인증 유효기간이 만료되었습니다.",
        description: "아래 재발송 버튼을 눌러 인증 메일을 다시 받아보세요.",
      }
    : {
        title: "이메일 인증이 되지 않았어요!",
        description:
          "회원가입을 완료했지만 이메일 인증이 아직 진행되지 않았어요.\n아래 버튼을 눌러 인증을 완료해주세요.",
      };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 bg-blue-50 lg:gap-10">
      <img src={emailHourglass} alt="email hourglass" className="h-35 w-35 lg:h-45 lg:w-45" />

      <div className="flex w-111 flex-col gap-5 lg:gap-8">
        <div className="flex flex-col gap-1 text-center lg:gap-2">
          <h1 className="text-gray-0 text-lg font-semibold lg:text-2xl">{content.title}</h1>
          <p className="text-sm font-normal whitespace-pre-line text-gray-300 lg:text-base">
            {content.description}
          </p>
        </div>

        <Button
          color="black"
          responsive
          responsiveButtons={{ lg: { buttonSize: "lg" }, md: { buttonSize: "md" } }}
        >
          이메일 재발송하기
        </Button>
      </div>
    </div>
  );
}

export default EmailPage;
