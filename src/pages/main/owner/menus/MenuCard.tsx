import loginBg from "@/assets/images/login-bg.png";
import Checkbox from "@/components/ui/Checkbox";
import cn from "@/lib/utils";
import type { Menu } from "@/types/domain/menu";

interface MenuCardProps {
  menu: Menu;
  isChecked: boolean;
  onCheckedChange: () => void;
  onClick: () => void;
}

function MenuCard({ menu, isChecked, onCheckedChange, onClick }: Readonly<MenuCardProps>) {
  return (
    <div
      className={cn(
        "relative aspect-152/210 cursor-pointer overflow-hidden rounded-xl md:aspect-159/220 lg:aspect-329/440 lg:rounded-3xl",
        isChecked && "outline-primary outline"
      )}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick();
        }
      }}
      role="button"
      tabIndex={0}
      onClick={onClick}
    >
      <img src={loginBg} alt={menu.name} className="h-full w-full object-cover" draggable="false" />
      <div
        className="absolute top-2.5 left-2.5 z-10 lg:top-4 lg:left-4"
        role="presentation"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Checkbox
          className="size-6 lg:size-8"
          checked={isChecked}
          onCheckedChange={onCheckedChange}
        />
      </div>
      <div className="absolute bottom-1.5 w-full px-1.5 md:bottom-1 md:px-1 lg:bottom-2 lg:px-2">
        <div className="flex flex-col gap-1 rounded-xl bg-white p-2 md:gap-0.5 md:p-3 lg:gap-2 lg:rounded-[20px] lg:px-5 lg:py-4">
          {(menu.state !== "DEFAULT" || menu.label !== "DEFAULT") && (
            <div className="flex items-center gap-2">
              {menu.label !== "DEFAULT" && (
                <button className="w-fit rounded-3xl bg-[#3900B514] px-3 py-1 text-xs text-[#3900B5] md:px-4 lg:text-sm">
                  {menu.label}
                </button>
              )}
              {menu.state !== "DEFAULT" && (
                <button className="w-fit rounded-3xl bg-[#F2202014] px-3 py-1 text-xs text-[#F22020] md:px-4 lg:text-sm">
                  {menu.state}
                </button>
              )}
            </div>
          )}
          <div className="mt-1 flex w-full flex-col items-start justify-between lg:mt-0 lg:flex-row lg:items-center">
            <span className="text-gray-0 text-s font-medium lg:text-lg lg:font-semibold">
              {menu.name}
            </span>
            <strong className="text-gray-0 text-xl font-semibold lg:text-[28px] lg:font-bold">
              {menu.price.toLocaleString()}원
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenuCard;
