import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const AuthLayout = lazy(() => import("@/pages/auth/AuthLayout"));
const LoginPage = lazy(() => import("@/pages/auth/login/LoginPage"));
const SignupPage = lazy(() => import("@/pages/auth/signup/SignupPage"));

function App() {
  return (
    <BrowserRouter>
      <div className="h-dvh w-dvw bg-white">
        <Routes>
          <Route path="/" element={<AuthLayout />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
