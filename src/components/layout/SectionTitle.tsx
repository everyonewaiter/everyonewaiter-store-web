import { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { User } from "@/components/icons";
import useOutsideClick from "@/hooks/useOutSideClick";

function SectionTitle() {
  const location = useLocation();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isOpenUser, setIsOpenUser] = useState(false);

  useOutsideClick({
    ref: dropdownRef,
    handler: () => setIsOpenUser(false),
  });

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

  if (!getText()) return null;

  const email = "asdf@gmail.com";

  const handleLogout = () => {
    // TODO: 로그아웃 로직
    setIsOpenUser(false);
  };

  return (
    <div className="relative hidden flex-col md:flex md:gap-2 lg:gap-5">
      <div ref={dropdownRef} className="relative flex items-center justify-between">
        <h2 className="text-gray-0 font-bold md:text-base lg:text-[28px]">{getText()}</h2>
        <button
          ref={buttonRef}
          className="center rounded-xl border border-gray-400 md:h-8 md:w-8 lg:h-12 lg:w-12 lg:rounded-2xl"
          onClick={() => setIsOpenUser((prev) => !prev)}
          aria-label="사용자 메뉴 버튼"
        >
          <User className="text-gray-400 md:size-6 lg:size-8" />
        </button>
        {isOpenUser && (
          <div className="absolute right-0 z-9999 flex flex-col gap-1 rounded-2xl bg-white p-3 shadow-[0px_2px_10px_0px_rgba(0,0,0,0.08)] md:top-9 lg:top-14">
            <div className="flex items-center gap-2 rounded-xl bg-gray-700 p-3">
              <div className="center h-5.5 w-5.5 rounded-full border border-gray-500 bg-white">
                <User className="size-4 text-gray-400" />
              </div>
              <span className="text-[15px] text-gray-100">{email}</span>
            </div>
            <button
              type="button"
              className="flex items-center gap-2 rounded-xl p-3"
              onClick={handleLogout}
            >
              <span className="text-[15px] text-gray-300">로그아웃</span>
            </button>
          </div>
        )}
      </div>
      <div className="h-px w-full bg-gray-500" />
    </div>
  );
}

export default SectionTitle;
