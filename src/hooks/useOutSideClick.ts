import type { RefObject } from "react";
import { useEffect } from "react";

interface UseOutsideClickProps {
  ref: RefObject<HTMLElement | null>;
  handler: (event: MouseEvent) => void;
}

/**
 * @description
 * - 지정된 요소의 외부를 클릭했을 때 특정 동작을 실행하는 훅
 * - `mousedown` 이벤트를 감지하여 요소 외부에서 발생한 클릭인지 확인 후, 핸들러를 호출
 *
 *  @param ref - 외부 클릭을 감지할 대상 요소의 `RefObject`.
 *  @param handler - 외부 클릭이 발생시 특정 동작을 실행하는 함수
 */
export default function useOutsideClick({ ref, handler }: UseOutsideClickProps) {
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      // NOTE - 요소 외부 클릭 감지
      // NOTE - 클릭 요소가 요소 내부에 있는 경우는 제외
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };

    globalThis.document.addEventListener("mousedown", listener);
    return () => {
      globalThis.document.removeEventListener("mousedown", listener);
    };
  }, [ref, handler]);
}
