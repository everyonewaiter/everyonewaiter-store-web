import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./pages/layout";

const LoginPage = lazy(() => import("./pages/login/LoginPage"));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="login" element={<LoginPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
