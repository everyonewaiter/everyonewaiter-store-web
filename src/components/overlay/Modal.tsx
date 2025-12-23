import { Close } from "@/components/icons";
import type { ReactNode } from "react";
import { useRef } from "react";
import useEscapeKey from "@/hooks/useEscapeKey";
import useOutsideClick from "@/hooks/useOutSideClick";

interface ModalLayoutProps {
  children: ReactNode;
  onClose: () => void;
}

/**
 * 모달 레이아웃 컴포넌트
 *
 * @description
 * 모달의 기본적인 형태 제공(외부 영역 스타일 처리 및 위치 조정, 닫기 버튼)
 * 버튼 및 키보드 ESC를 통해 모달 동작 제어
 *
 * @param children - 모달 내부에 렌더링할 콘텐츠
 * @param onClose - 모달을 닫는 핸들러 함수, useOverlay의 close
 *
 * @example
 * ```tsx
 * <ModalLayout onClose={close}>
 *   <h1>모달 제목</h1>
 *   <p>모달 내용</p>
 * </ModalLayout>
 * ```
 */
export default function ModalLayout({ children, onClose }: ModalLayoutProps) {
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick({
    ref,
    handler: () => {
      onClose();
    },
  });
  useEscapeKey({
    handler: onClose,
  });

  return (
    <div className="bg-opacity-100 fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div ref={ref} className="relative rounded-md bg-white p-4 lg:p-5">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2"
        >
          <Close width={24} height={24} color="#222" />
        </button>
        {children}
      </div>
    </div>
  );
}
