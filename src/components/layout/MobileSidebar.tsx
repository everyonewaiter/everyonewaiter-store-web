import { useState, type ReactNode } from "react";
import logoText from "@/assets/images/logo-text.svg";
import logo from "@/assets/images/logo.svg";
import { Hamburger } from "@/components/icons";
import Sidebar from "@/components/layout/Sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/Sheet";

interface MobileSidebarProps {
  children: ReactNode;
}

function MobileSidebar({ children }: Readonly<MobileSidebarProps>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="left" className="mt-7 rounded-tr-3xl rounded-br-3xl md:hidden">
        <Sidebar onLinkClick={() => setIsOpen(false)} />
      </SheetContent>

      <div className="flex h-screen flex-col md:h-auto">
        <header className="relative flex items-center justify-center gap-3 border-b border-b-gray-600 px-5 pt-5 pb-4 md:hidden">
          <img src={logo} alt="logo text horizontal" className="size-6" />
          <img src={logoText} alt="logo text horizontal" className="md:w-29.5 lg:w-55" />
          <SheetTrigger className="absolute left-5">
            <Hamburger className="text-gray-0 size-6" />
          </SheetTrigger>
        </header>
        <div className="flex flex-1 flex-col md:flex-none">{children}</div>
      </div>
    </Sheet>
  );
}

export default MobileSidebar;
