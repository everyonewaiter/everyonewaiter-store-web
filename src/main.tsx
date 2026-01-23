import { QueryClientProvider } from "@tanstack/react-query";
import { OverlayProvider } from "overlay-kit";
import { createRoot } from "react-dom/client";
import "@/index.css";
import App from "@/App";
import Toaster from "@/components/overlay/Toaster";
import { queryClient } from "@/lib/query-client";

createRoot(globalThis.document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <OverlayProvider>
      <App />
    </OverlayProvider>
  </QueryClientProvider>
);
