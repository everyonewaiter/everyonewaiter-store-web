import { Outlet } from "react-router-dom";
import loginBgLg from "@/assets/images/login-bg-lg@2x.webp";
import loginBgMd from "@/assets/images/login-bg-md@2x.webp";

function PublicPageLayout() {
  return (
    <div className="relative flex min-h-dvh w-dvw bg-white px-5 md:items-start md:pl-6 lg:items-center lg:pl-15">
      <div className="center min-h-dvh w-full flex-col gap-10 overflow-y-auto md:flex-[0.4] md:py-8 lg:gap-12 lg:py-16">
        <Outlet />
      </div>
      <div className="top-0 hidden h-screen md:sticky md:block md:flex-[0.6] lg:relative">
        <div className="relative h-full md:p-4 lg:p-6">
          <picture>
            <source media="(min-width: 1920px)" srcSet={loginBgLg} />
            <source media="(min-width: 960px)" srcSet={loginBgMd} />
            <img
              src={loginBgMd}
              alt="login background"
              className="h-full w-full object-cover md:rounded-3xl"
              fetchPriority="high"
              loading="eager"
            />
          </picture>
        </div>
      </div>
    </div>
  );
}

export default PublicPageLayout;
