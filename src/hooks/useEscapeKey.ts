import { useEffect } from "react";

interface UseEscapeKeyProps {
  handler: () => void;
}

/**
 * @description
 * - Escape-Key를 감지하여 특정 동작 수행하도록 하는 훅
 * - keydown 이벤트가 실행되면 지정된 핸들러 시행
 *
 * @param handler - `Escape` 키를 눌렀을 때 호출할 함수.
 *
 */
export default function useEscapeKey({ handler }: UseEscapeKeyProps) {
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handler();
      }
    };

    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [handler]);
}
