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
        "relative aspect-329/440 overflow-hidden rounded-3xl",
        isChecked && "border-primary border-"
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
      <img src={loginBg} alt={menu.name} className="h-full w-full object-cover" />
      <div className="absolute top-4 left-4 z-10">
        <Checkbox size={32} checked={isChecked} onCheckedChange={onCheckedChange} />
      </div>
      <div className="absolute bottom-2 w-full px-2">
        <div className="flex flex-col gap-2 rounded-[20px] bg-white px-5 py-4">
          {(menu.state !== "DEFAULT" || menu.label !== "DEFAULT") && (
            <div className="flex items-center gap-2">
              {menu.label !== "DEFAULT" && (
                <button className="w-fit rounded-3xl bg-[#3900B514] px-4 py-1 text-[#3900B5]">
                  {menu.label}
                </button>
              )}
              {menu.state !== "DEFAULT" && (
                <button className="w-fit rounded-3xl bg-[#F2202014] px-4 py-1 text-[#F22020]">
                  {menu.state}
                </button>
              )}
            </div>
          )}
          <div className="flex w-full items-center justify-between">
            <span className="text-gray-0 text-lg font-semibold">{menu.name}</span>
            <strong className="text-gray-0 text-[28px] font-bold">
              {menu.price.toLocaleString()}원
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenuCard;
