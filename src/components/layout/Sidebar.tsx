import type { ElementType } from "react";
import { Link, useLocation } from "react-router-dom";
import logoTextHorizontal from "@/assets/images/logo-text-horizontal.svg";
import { Category, Home, Mobile, Settings, Shop } from "@/components/icons";
import Dropdown from "@/components/ui/Dropdown";
import cn from "@/lib/utils";

const STORES_MOCK = [
  { id: "1", name: "매장 1" },
  { id: "2", name: "매장 2" },
  { id: "3", name: "매장 3" },
];

const sidebarItems = [
  {
    label: "HOME",
    icon: Home,
    path: "/",
  },
  {
    label: "매장 정보",
    icon: Shop,
    path: "/store",
  },
  {
    label: "메뉴 관리",
    icon: Category,
    path: "/menu",
  },
  {
    label: "기기 관리",
    icon: Mobile,
    path: "/device",
  },
  {
    label: "설정",
    icon: Settings,
    path: "/settings",
  },
];

function IconComp({ Icon, className }: Readonly<{ Icon: ElementType; className: string }>) {
  return <Icon className={cn("size-6 lg:size-8", className)} />;
}

function Sidebar() {
  const { pathname } = useLocation();
  const selectedStore = STORES_MOCK[0];

  return (
    <>
      <Link to="/" className="flex items-center px-4 pt-5 pb-2.5 md:pt-4 lg:px-6 lg:py-8 lg:pb-5">
        <img
          src={logoTextHorizontal}
          alt="logo text horizontal"
          className="w-39.5 md:w-37 lg:w-55"
        />
      </Link>
      <div className="flex flex-col gap-4 px-4 md:gap-2 md:px-3 lg:px-5">
        <Dropdown
          // TODO: 매장 api 연결 후 조건 수정
          dropdownItems={STORES_MOCK.filter((store) => store.id !== selectedStore.id)}
          defaultText={STORES_MOCK[0].name}
          triggerClassName={
            "bg-primary border-primary text-white text-[15px] font-semibold lg:text-lg lg:font-bold pl-4 pr-3 lg:pl-5 pr-4 h-12 lg:h-14"
          }
          iconClassName="text-white"
        />
        <nav>
          {sidebarItems.map((item, index) => {
            const isSelected =
              index === 0 ? ["/", "/create"].includes(pathname) : pathname.startsWith(item.path);

            return (
              <Link to={item.path} className="flex h-10.5 lg:h-14" key={item.label}>
                <div className="center relative w-1.5 lg:w-2">
                  <div
                    className={cn(
                      "z-50 h-1.5 w-1.5 rounded-full bg-gray-600 lg:h-2 lg:w-2",
                      isSelected && "bg-primary"
                    )}
                  />
                  {index !== sidebarItems.length - 1 && (
                    <div className="absolute top-1/2 mt-[3px] h-[calc(100%-6px)] w-px bg-gray-600 lg:w-0.5" />
                  )}
                </div>
                <div className="flex flex-1 items-center gap-1.5 py-[9px] pr-3 pl-2 lg:py-3 lg:pr-4 lg:pl-3">
                  <IconComp
                    Icon={item.icon}
                    className={cn("text-gray-300", isSelected && "text-primary")}
                  />
                  <span
                    className={cn(
                      "text-s font-medium text-gray-300 lg:text-base",
                      isSelected && "text-primary"
                    )}
                  >
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}

export default Sidebar;
