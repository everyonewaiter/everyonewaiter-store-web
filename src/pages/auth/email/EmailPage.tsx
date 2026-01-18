import { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { accountMutations } from "@/api/account/mutations";
import Spinner from "@/components/feedback/Spinner";
import { errorResponse } from "@/lib/error-response";
import EmailContent from "@/pages/auth/email/EmailContent";

function EmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const type = searchParams.get("type");
  const email = searchParams.get("email");

  const { mutate: verifyAuthMail } = useMutation(accountMutations.verifyAuthMail());
  const { mutate: sendAuthMail } = useMutation(accountMutations.sendAuthMail());

  const [isExpired, setIsExpired] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleAlreadyVerified = useCallback(() => {
    toast.success("이미 인증된 이메일입니다.");
    setTimeout(() => navigate("/login"), 1000);
  }, [navigate]);

  useEffect(() => {
    if (!token || !email) {
      toast.error("유효하지 않은 인증 요청입니다.");
      navigate("/login");
      return;
    }

    verifyAuthMail(token, {
      onSuccess: () => {
        navigate("/login");
      },
      onError: (error) => {
        const { data } = errorResponse(error);
        if (data.code === "ALREADY_VERIFIED_EMAIL") {
          handleAlreadyVerified();
          return;
        }
        if (data.code === "EXPIRED_VERIFICATION_MAIL") {
          setIsExpired(true);
          return;
        }

        toast.error(data.message);
      },
    });
  }, [token, email, navigate, verifyAuthMail, handleAlreadyVerified]);

  const handleResendEmail = () => {
    if (isResending) return;
    if (!email) {
      toast.error("이메일 정보가 없습니다.");
      return;
    }

    setIsResending(true);

    sendAuthMail(
      { email },
      {
        onSuccess: () => toast.success("이메일 인증 확인 메일 발송 성공!"),
        onError: (error) => {
          const { status, data } = errorResponse(error);

          if (data.code === "ALREADY_VERIFIED_EMAIL") {
            handleAlreadyVerified();
            return;
          }

          if (status === 404) {
            toast.error(data.message);
          }

          setIsResending(false);
        },
      }
    );
  };

  const content = useMemo(() => {
    if (isExpired) {
      return {
        title: "이메일 인증 유효기간이 만료되었습니다.",
        description: "아래 재발송 버튼을 눌러 인증 메일을 다시 받아보세요.",
      };
    }

    if (type === "not-verified") {
      return {
        title: "이메일 인증이 되지 않았어요!",
        description:
          "회원가입을 완료한 뒤, 하루가 지났다면\n아래 재발송 버튼을 눌러, 이메일 인증을 완료해주세요.",
      };
    }

    return {
      title: "이메일 인증 상태를 확인하고 있어요",
      description: "잠시만 기다려 주세요. (약 1~5초 소요)",
      bottomComponent: <Spinner />,
    };
  }, [isExpired, type]);

  return <EmailContent {...content} onResendEmail={handleResendEmail} isResending={isResending} />;
}

export default EmailPage;
