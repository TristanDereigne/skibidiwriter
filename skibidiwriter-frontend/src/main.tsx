import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

import "./index.css";

import App from "./layout/app.tsx";
import Public from "./layout/public.tsx";

import { AuthProvider } from "./context/AuthContext.tsx";
import { EditPage } from "./pages/app/edit.page.tsx";
import { ExplorerPage } from "./pages/app/explorer.page.tsx";
import { ProfilePage } from "./pages/app/profile.page.tsx";
import { LoginPage } from "@/pages/public/login.page.tsx";
import { RegisterPage } from "@/pages/public/register.page.tsx";
import { HeaderProvider } from "@/context/HeaderContext.tsx";
import { UserProvider } from "@/context/UserContext.tsx";

createRoot(document.getElementById("root")!).render(
  <UserProvider>
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
  </UserProvider>,
);
