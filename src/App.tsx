import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const AuthLayout = lazy(() => import("@/pages/auth/AuthLayout"));
const LoginPage = lazy(() => import("@/pages/auth/login/LoginPage"));
const SignupPage = lazy(() => import("@/pages/auth/signup/SignupPage"));
const SignupLoadingPage = lazy(() => import("@/pages/auth/signup/result/SignupLoadingPage"));
const SignupResultPage = lazy(() => import("@/pages/auth/signup/result/SignupResultPage"));

function App() {
  return (
    <BrowserRouter>
      <div className="h-dvh w-dvw bg-white">
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
            <Route path="signup/loading" element={<SignupLoadingPage />} />
            <Route path="signup/result" element={<SignupResultPage />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
