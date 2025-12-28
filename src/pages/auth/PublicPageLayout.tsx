import { Outlet } from "react-router-dom";
import loginBg from "@/assets/images/login-bg.png";

// TODO: 로그인된 사용자가 이 레이아웃을 사용하는 페이지에 접근하면 홈으로 리다이렉트하는 로직 추가
function PublicPageLayout() {
  return (
    <div className="relative flex min-h-dvh w-dvw bg-white px-5 md:items-start md:pl-6 lg:items-center lg:pl-15">
      <div className="center min-h-dvh w-full flex-col gap-10 overflow-y-auto md:flex-[0.4] md:py-8 lg:gap-12 lg:py-16">
        <Outlet />
      </div>
      <div className="top-0 hidden h-screen md:sticky md:block md:flex-[0.6] lg:relative">
        <div className="relative h-full md:p-4 lg:p-6">
          <img
            src={loginBg}
            alt="login background"
            loading="eager"
            fetchPriority="high"
            aria-label="login background"
            className="h-full w-full object-cover md:rounded-3xl"
          />
        </div>
      </div>
    </div>
  );
}

export default PublicPageLayout;
