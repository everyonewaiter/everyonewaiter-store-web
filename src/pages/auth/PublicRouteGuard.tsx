import { useEffect } from "react";
import type { PropsWithChildren } from "react";
import { useNavigate } from "react-router-dom";

/**
 * 공개 라우트(로그인, 회원가입, 이메일 인증)를 보호하는 컴포넌트
 * 로그인된 사용자가 접근하면 홈으로 리다이렉트
 */
function PublicRouteGuard({ children }: Readonly<PropsWithChildren>) {
  const navigate = useNavigate();

  useEffect(() => {
    // TODO: 로그인된 사용자라면 /로 리다이렉트
  }, [navigate]);

  return <>{children}</>;
}

export default PublicRouteGuard;
