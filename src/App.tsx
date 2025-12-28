import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  Route,
  RouterProvider,
} from "react-router-dom";
import LoginPage from "@/pages/auth/login/LoginPage";
import PublicPageLayout from "@/pages/auth/PublicPageLayout";
import SignupLoadingPage from "@/pages/auth/signup/result/SignupLoadingPage";
import SignupResultPage from "@/pages/auth/signup/result/SignupResultPage";
import SignupPage from "@/pages/auth/signup/SignupPage";
import GuestCreatePage from "@/pages/main/guest/create/GuestCreatePage";
import GuestPage from "@/pages/main/guest/GuestPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      element={
        <div className="h-dvh w-dvw bg-white">
          <Outlet />
        </div>
      }
    >
      <Route element={<PublicPageLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="signup/loading" element={<SignupLoadingPage />} />
        <Route path="signup/result" element={<SignupResultPage />} />
      </Route>

      <Route path="/guest" element={<GuestPage />} />
      <Route path="/guest/create" element={<GuestCreatePage />} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
