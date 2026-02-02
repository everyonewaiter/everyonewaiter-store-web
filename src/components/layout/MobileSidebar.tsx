import { useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logoText from "@/assets/images/logo-text.svg";
import logo from "@/assets/images/logo.svg";
import { ChevronLeft, Hamburger } from "@/components/icons";
import Sidebar from "@/components/layout/Sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/Sheet";

interface MobileSidebarProps {
  children: ReactNode;
}

function MobileSidebar({ children }: Readonly<MobileSidebarProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isGuestPage = location.pathname.startsWith("/guest");
  const isGuestChildrenPage = isGuestPage && location.pathname !== "/guest";

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="left" className="mt-7 rounded-tr-3xl rounded-br-3xl md:hidden">
        <Sidebar closeMobile={() => setIsOpen(false)} />
      </SheetContent>

      <div className="flex h-dvh flex-col md:h-full">
        <header className="fixed flex w-full shrink-0 items-center justify-center gap-3 border-b border-b-gray-600 bg-white px-5 pt-5 pb-4 md:relative md:hidden">
          <img src={logo} alt="logo text horizontal" className="size-6" />
          <img src={logoText} alt="logo text horizontal" className="md:w-29.5 lg:w-55" />
          {isGuestChildrenPage && (
            <button className="absolute left-5" onClick={() => navigate(-1)}>
              <ChevronLeft className="text-gray-0 size-8" />
            </button>
          )}
          {!isGuestPage && (
            <SheetTrigger className="absolute left-5">
              <Hamburger className="text-gray-0 size-6" />
            </SheetTrigger>
          )}
        </header>
        <div className="flex min-h-0 flex-1 pt-15 md:pt-0">{children}</div>
      </div>
    </Sheet>
  );
}

export default MobileSidebar;
