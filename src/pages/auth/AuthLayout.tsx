import { Outlet } from "react-router-dom";
import loginBg from "@/assets/images/login-bg.png";
import logoTextHorizontal from "@/assets/images/logo-text-horizontal.svg";

function AuthLayout() {
  return (
    <div className="relative flex min-h-dvh w-dvw md:items-start md:pl-6 lg:items-center lg:pl-15">
      <div className="center min-h-dvh flex-col gap-10 overflow-y-auto px-5 md:flex-[0.4] md:py-8 lg:gap-12 lg:py-16">
        <img
          src={logoTextHorizontal}
          alt="logo text horizontal"
          className="w-40 max-w-50 md:w-[37%]"
        />
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

export default AuthLayout;
