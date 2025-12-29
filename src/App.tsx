import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "@/pages/HomePage";

const LoginPage = lazy(() => import("@/pages/auth/login/LoginPage"));
const SignupPage = lazy(() => import("@/pages/auth/signup/SignupPage"));
const SignupLoadingPage = lazy(() => import("@/pages/auth/signup/result/SignupLoadingPage"));
const SignupResultPage = lazy(() => import("@/pages/auth/signup/result/SignupResultPage"));

const MainDevicePage = lazy(() => import("@/pages/main/owner/devices/MainDevicePage"));
const MainMenuPage = lazy(() => import("@/pages/main/owner/menus/MainMenuPage"));
const MainSettingsPage = lazy(() => import("@/pages/main/owner/settings/MainSettingsPage"));
const MainInfoPage = lazy(() => import("@/pages/main/owner/info/MainInfoPage"));

const PublicPageLayout = lazy(() => import("@/pages/auth/PublicPageLayout"));
const RootLayout = lazy(() => import("@/pages/main/RootLayout"));

function App() {
  return (
    <BrowserRouter>
      <div className="h-dvh w-dvw bg-white">
        <Routes>
          <Route element={<PublicPageLayout />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
            <Route path="signup/loading" element={<SignupLoadingPage />} />
            <Route path="signup/result" element={<SignupResultPage />} />
          </Route>

          <Route element={<RootLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/info" element={<MainInfoPage />} />
            <Route path="/devices" element={<MainDevicePage />} />
            <Route path="/menus" element={<MainMenuPage />} />
            <Route path="/settings" element={<MainSettingsPage />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
