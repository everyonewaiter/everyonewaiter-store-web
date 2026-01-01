import { useEffect, useRef } from "react";
import { createRoot, type Root } from "react-dom/client";
import { useNavigate } from "react-router-dom";
import LeaveConfirmModal from "@/components/form/LeaveConfirmModal";

export function useFormBlocker(isDirty: boolean) {
  const shouldBlockRef = useRef(true);
  const isInitialPushRef = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isDirty) {
      shouldBlockRef.current = false;
      isInitialPushRef.current = false;
      return;
    }

    shouldBlockRef.current = true;

    let root: Root | null = null;
    let modalContainer: HTMLDivElement | null = null;

    const handleCloseModal = () => {
      if (root) {
        root.unmount();
        root = null;
      }
      if (modalContainer) {
        modalContainer.remove();
        modalContainer = null;
      }
    };

    const handleConfirm = () => {
      handleCloseModal();
      shouldBlockRef.current = false;

      setTimeout(() => {
        navigate(-1);
      }, 0);
    };

    const handlePopState = (e: PopStateEvent) => {
      if (!shouldBlockRef.current) return;

      e.preventDefault();

      if (modalContainer) return;

      modalContainer = document.createElement("div");
      document.body.appendChild(modalContainer);

      root = createRoot(modalContainer);
      root.render(
        <LeaveConfirmModal isOpen={true} onCancel={handleCloseModal} onConfirm={handleConfirm} />
      );
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!shouldBlockRef.current) return;

      e.preventDefault();
      if ("returnValue" in e) {
        (e as BeforeUnloadEvent & { returnValue: string }).returnValue = "";
      }
    };

    if (!isInitialPushRef.current) {
      globalThis.window.history.pushState(null, "", globalThis.window.location.pathname);
      isInitialPushRef.current = true;
    }

    globalThis.window.addEventListener("popstate", handlePopState);
    globalThis.window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      globalThis.window.removeEventListener("popstate", handlePopState);
      globalThis.window.removeEventListener("beforeunload", handleBeforeUnload);
      if (root) {
        root.unmount();
      }
      if (modalContainer) {
        modalContainer.remove();
      }
    };
  }, [isDirty, navigate]);
}
