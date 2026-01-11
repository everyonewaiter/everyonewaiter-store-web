import { useRef } from "react";
import { useLocation } from "react-router-dom";
import { User } from "@/components/icons";

function SectionTitle() {
  const location = useLocation();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const getText = () => {
    const pathname = location.pathname;
    if (pathname === "/") {
      return "매장 등록 현황";
    } else if (pathname === "/stores") {
      return "매장 정보";
    } else if (pathname === "/devices") {
      return "기기 관리";
    } else if (pathname === "/menus") {
      return "메뉴 관리";
    } else if (pathname === "/settings") {
      return "설정";
    }
  };

  const handleOpenUser = () => {
    // TODO: 유저 액션 모달 구현
  };

  if (!getText()) return null;

  return (
    <div className="relative hidden flex-col md:flex md:gap-2 lg:gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-gray-0 font-bold md:text-base lg:text-[28px]">{getText()}</h2>
        <button
          ref={buttonRef}
          className="center rounded-2xl border border-gray-400 md:h-8 md:w-8 lg:h-12 lg:w-12"
          onClick={handleOpenUser}
        >
          <User className="text-gray-400 md:size-6 lg:size-8" />
        </button>
      </div>
      <div className="h-px w-full bg-gray-500" />
    </div>
  );
}

export default SectionTitle;
