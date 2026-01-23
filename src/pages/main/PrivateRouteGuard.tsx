import { Navigate, Outlet } from "react-router-dom";

/**
 * 비공개 라우트(매장 등록, 매장 관리, 메뉴 관리, 설정 등)를 보호하는 컴포넌트
 * 로그인되지 않은 사용자가 접근하면 로그인 페이지로 리다이렉트
 */
function PrivateRouteGuard() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default PrivateRouteGuard;
