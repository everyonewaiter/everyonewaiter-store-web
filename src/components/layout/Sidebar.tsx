import { useMemo, useState, type ElementType } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { storesQueries } from "@/api/stores/queries";
import logoTextHorizontal from "@/assets/images/logo-text-horizontal.svg";
import { Skeleton } from "@/components/feedback/Skeleton";
import { Category, Home, Mobile, Settings, Shop } from "@/components/icons";
import Dropdown from "@/components/ui/Dropdown";
import cn from "@/lib/utils";
import { useStoreId } from "@/stores/useStoreId";

const sidebarItems = [
  {
    label: "HOME",
    icon: Home,
    path: "/",
  },
  {
    label: "매장 정보",
    icon: Shop,
    path: "/stores",
  },
  {
    label: "메뉴 관리",
    icon: Category,
    path: "/menus",
  },
  {
    label: "기기 관리",
    icon: Mobile,
    path: "/devices",
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

interface SidebarProps {
  closeMobile?: () => void;
}

function Sidebar({ closeMobile }: Readonly<SidebarProps>) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { data: stores, isLoading } = useQuery(storesQueries.getStores());
  const { setStoreId } = useStoreId();
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);

  const selectedStore = useMemo(() => {
    if (selectedStoreId && stores?.stores) {
      const found = stores.stores.find((store) => store.storeId === selectedStoreId);
      if (found) return found;
    }
    return stores?.stores?.[0] ?? null;
  }, [stores, selectedStoreId]);

  const handleCloseMobile = () => {
    if (closeMobile) {
      closeMobile();
    } else {
      navigate("/");
    }
  };

  return (
    <>
      <button
        onClick={handleCloseMobile}
        className="flex items-center px-4 pt-5 pb-2.5 md:pt-4 lg:px-6 lg:py-8 lg:pb-5"
      >
        <img
          src={logoTextHorizontal}
          alt="logo text horizontal"
          width={220}
          height={40}
          className="w-39.5 md:w-37 lg:w-55"
          loading="eager"
          fetchPriority="high"
        />
      </button>
      <div className="flex min-w-0 flex-col gap-4 px-4 md:gap-2 md:px-3 lg:px-5">
        <div className="min-w-0">
          {isLoading || !selectedStore ? (
            <Skeleton>
              <Skeleton.Input />
            </Skeleton>
          ) : (
            <Dropdown
              dropdownItems={
                stores?.stores
                  ? stores.stores.map((store) => ({
                      id: store.storeId,
                      name: store.name,
                    }))
                  : []
              }
              value={selectedStore.storeId}
              onChange={(item) => {
                setSelectedStoreId(item.id);
                setStoreId(item.id);
                navigate("/");
              }}
              defaultText={selectedStore.name}
              triggerClassName={
                "bg-primary border-primary text-white text-sm font-semibold lg:text-lg lg:font-bold pl-4 pr-3 lg:pl-5 pr-4 h-12 lg:h-14 w-full min-w-0 overflow-hidden text-ellipsis whitespace-nowrap"
              }
              iconClassName="text-white shrink-0"
            />
          )}
        </div>
        <nav>
          {sidebarItems.map((item, index) => {
            const isSelected =
              index === 0 ? ["/", "/create"].includes(pathname) : pathname.startsWith(item.path);

            return (
              <Link
                to={item.path}
                onClick={handleCloseMobile}
                className="flex h-10.5 lg:h-14"
                key={item.label}
              >
                <div className="center relative w-1.5 lg:w-2">
                  <div
                    className={cn(
                      "z-50 h-1.5 w-1.5 rounded-full bg-gray-600 lg:h-2 lg:w-2",
                      isSelected && "bg-primary"
                    )}
                  />
                  {index !== sidebarItems.length - 1 && (
                    <div className="absolute top-1/2 mt-0.75 h-[calc(100%-6px)] w-px bg-gray-600 lg:w-0.5" />
                  )}
                </div>
                <div className="flex flex-1 items-center gap-1.5 py-2.25 pr-3 pl-2 lg:py-3 lg:pr-4 lg:pl-3">
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
