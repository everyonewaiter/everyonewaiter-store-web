import { useState } from "react";
import { Outlet } from "react-router-dom";
import logoTextHorizontal from "@/assets/images/logo-text-horizontal.svg";
import MobileSidebar from "@/components/layout/MobileSidebar";
import Sidebar from "@/components/layout/Sidebar";

function RootLayout() {
  const [isUser] = useState(true);

  // TODO: 로그인 여부 확인 후 리다이렉트

  return (
    <MobileSidebar>
      {isUser ? (
        // 승인된 매장이 있을 경우
        <div className="flex h-full w-full flex-col bg-gray-700 md:h-dvh md:flex-row md:gap-2.5 md:px-5 md:py-5 lg:gap-6 lg:px-15 lg:py-8">
          <aside className="hidden h-auto shrink-0 flex-col rounded-[28px] bg-white md:flex md:w-46.5 md:gap-3 lg:w-79.5 lg:gap-4">
            <Sidebar />
          </aside>
          <article className="flex h-full min-w-0 flex-1 flex-col bg-white md:rounded-[28px] md:p-5 lg:p-8">
            <div className="hide-scrollbar flex flex-col overflow-y-auto">
              <Outlet />
            </div>
          </article>
        </div>
      ) : (
        // 승인된 매장이 없을 경우
        <div className="flex h-screen w-screen flex-col bg-gray-700">
          <header className="hidden flex-col md:flex md:gap-4 md:px-6 md:pt-3 lg:gap-6 lg:px-15 lg:pt-10">
            <img
              src={logoTextHorizontal}
              alt="logo text horizontal"
              className="md:w-29.5 lg:w-55"
            />
            <div className="h-px w-full bg-gray-500" />
          </header>
          <Outlet />
          <main className="flex flex-1 items-center justify-center">1</main>
        </div>
      )}
    </MobileSidebar>
  );
}

export default RootLayout;
