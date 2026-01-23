import { lazy } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { storesQueries } from "@/api/stores/queries";
import logoTextHorizontal from "@/assets/images/logo-text-horizontal.svg";
import MobileSidebar from "@/components/layout/MobileSidebar";
import SectionTitle from "@/components/layout/SectionTitle";

const Sidebar = lazy(() => import("@/components/layout/Sidebar"));

function RootLayout() {
  const location = useLocation();
  const isGuest = location.pathname.startsWith("/guest");

  const { data: stores, isLoading } = useQuery(storesQueries.getStores());

  if ((stores?.stores?.length ?? 0) === 0 && !isGuest) {
    return <Navigate to="/guest" replace />;
  }

  if ((stores?.stores?.length ?? 0) > 0 && isGuest) {
    return <Navigate to="/" replace />;
  }

  if (isLoading) return null;

  return (
    <MobileSidebar>
      {isGuest ? (
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

          <main className="flex flex-1 items-center justify-center">
            <Outlet />
          </main>
        </div>
      ) : (
        // 승인된 매장이 있을 경우
        <div className="flex h-full w-full flex-col bg-gray-700 md:h-dvh md:flex-row md:gap-2.5 md:px-5 md:py-5 lg:gap-6 lg:px-15 lg:py-8">
          <aside className="hidden h-auto shrink-0 flex-col rounded-[28px] bg-white md:flex md:w-46.5 md:gap-3 lg:w-79.5 lg:gap-4">
            <Sidebar />
          </aside>
          <article className="flex h-full min-w-0 flex-1 flex-col bg-white md:rounded-[28px] md:p-5 lg:p-8">
            <SectionTitle />
            <div className="flex h-full flex-col md:overflow-y-auto">
              <Outlet />
            </div>
          </article>
        </div>
      )}
    </MobileSidebar>
  );
}

export default RootLayout;
