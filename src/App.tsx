import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import RootLayout from "@/pages/main/RootLayout";

const LoginPage = lazy(() => import("@/pages/login/LoginPage"));

function App() {
  return (
    <BrowserRouter>
      <div className="h-dvh w-dvw bg-white">
        <Routes>
          <Route path="login" element={<LoginPage />} />

          <Route element={<RootLayout />}>
            <Route path="/" element={<HomePage />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
