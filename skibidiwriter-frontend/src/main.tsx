import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

import "./index.css";

import App from "./App.tsx";
import Public from "./Public.tsx";

import { AuthProvider } from "./context/AuthContext.tsx";
import { EditPage } from "./pages/app/edit.page.tsx";
import { ExplorerPage } from "./pages/app/explorer.page.tsx";
import { ProfilePage } from "./pages/app/profile.page.tsx";
import { LoginPage } from "./pages/auth/login.page.tsx";
import { RegisterPage } from "./pages/auth/register.page.tsx";
import {HeaderProvider} from "@/context/HeaderContext.tsx";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <HeaderProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Public />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>
          <Route element={<App />}>
            <Route path="profile" element={<ProfilePage />} />
            <Route path="/:folderId?" element={<ExplorerPage />} />
            <Route path="edit/:documentId" element={<EditPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </HeaderProvider>
  </AuthProvider>
);