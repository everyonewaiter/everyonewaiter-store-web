import { useRef } from "react";
import { useLocation } from "react-router-dom";
import { User } from "@/components/icons";

function SectionTitle() {
  const location = useLocation();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const getText = () => {
    switch (location.pathname) {
      case "/info":
        return "매장 정보";
      case "/devices":
        return "기기 관리";
      case "/menus":
        return "메뉴 관리";
      case "/settings":
        return "설정";
      default:
        return "매장 신청 현황";
    }
  };

  const handleOpenUser = () => {
    // TODO: 유저 액션 모달 구현
  };

  return (
    <div className="relative flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-gray-0 text-[28px] font-bold">{getText()}</h2>
        <button
          ref={buttonRef}
          className="center h-12 w-12 rounded-2xl border border-gray-400"
          onClick={handleOpenUser}
        >
          <User className="size-8 text-gray-400" />
        </button>
      </div>
      <div className="h-px w-full bg-gray-500" />
    </div>
  );
}

export default SectionTitle;
