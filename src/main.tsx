import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import Toaster from "./components/overlay/Toaster";

const queryClient = new QueryClient();

createRoot(globalThis.document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <App />
  </QueryClientProvider>
);
