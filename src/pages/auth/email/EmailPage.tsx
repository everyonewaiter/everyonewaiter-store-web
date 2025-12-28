import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import EmailContent from "@/pages/auth/email/EmailContent";

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

  const handleResendEmail = () => {
    // TODO: 이메일 재발송 로직 구현
  };

  return <EmailContent {...content} onResendEmail={handleResendEmail} />;
}

export default EmailPage;
