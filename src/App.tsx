import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  Route,
  RouterProvider,
} from "react-router-dom";
import EmailPage from "@/pages/auth/email/EmailPage";
import LoginPage from "@/pages/auth/login/LoginPage";
import PublicPageLayout from "@/pages/auth/PublicPageLayout";
import PublicRouteGuard from "@/pages/auth/PublicRouteGuard";
import SignupLoadingPage from "@/pages/auth/signup/result/SignupLoadingPage";
import SignupResultPage from "@/pages/auth/signup/result/SignupResultPage";
import SignupPage from "@/pages/auth/signup/SignupPage";
import HomePage from "@/pages/HomePage";
import GuestApplicationPage from "@/pages/main/guest/application/GuestApplicationPage";
import GuestCreatePage from "@/pages/main/guest/create/GuestCreatePage";
import GuestPage from "@/pages/main/guest/GuestPage";
import MainDevicePage from "@/pages/main/owner/devices/MainDevicePage";
import MainInfoPage from "@/pages/main/owner/info/MainInfoPage";
import MainMenuCategoryPage from "@/pages/main/owner/menus/category/MainMenuCategoryPage";
import MainMenuPage from "@/pages/main/owner/menus/MainMenuPage";
import MainSettingsPage from "@/pages/main/owner/settings/MainSettingsPage";
import RootLayout from "@/pages/main/RootLayout";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      element={
        <div className="h-dvh w-dvw bg-white">
          <Outlet />
        </div>
      }
    >
      <Route element={<PublicRouteGuard />}>
        <Route element={<PublicPageLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="signup/loading" element={<SignupLoadingPage />} />
          <Route path="signup/result" element={<SignupResultPage />} />
        </Route>

        <Route path="email" element={<EmailPage />} />
      </Route>

      <Route element={<RootLayout />}>
        <Route path="/guest" element={<GuestPage />} />
        <Route path="/guest/create" element={<GuestCreatePage />} />

        <Route path="/" element={<HomePage />} />
        <Route path="/stores" element={<MainInfoPage />} />
        <Route path="/devices" element={<MainDevicePage />} />
        <Route path="/menus" element={<MainMenuPage />} />
        <Route path="/menus/category" element={<MainMenuCategoryPage />} />
        <Route path="/settings" element={<MainSettingsPage />} />
      </Route>
      <Route path="/guest/application" element={<GuestApplicationPage />} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
