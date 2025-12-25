import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const LoginPage = lazy(() => import("@/pages/login/LoginPage"));

function App() {
  return (
    <BrowserRouter>
      <div className="h-dvh w-dvw bg-white">
        <Routes>
          <Route path="login" element={<LoginPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
