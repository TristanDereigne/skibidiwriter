import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

import "./index.css";

import App from "./layout/app.tsx";
import Public from "./layout/public.tsx";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster, ToastProvider } from "@/components/ui/toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserProvider } from "@/context/UserContext.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext.tsx";

import { LoginPage } from "@/pages/public/login.page.tsx";
import { RegisterPage } from "@/pages/public/register.page.tsx";
import { EditPage } from "./pages/app/edit.page.tsx";
import { ExplorerPage } from "./pages/app/explorer.page.tsx";
import { ProfilePage } from "./pages/app/profile.page.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <AuthProvider>
        <ThemeProvider>
          <TooltipProvider>
            <ToastProvider>
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
              <Toaster />
            </ToastProvider>
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </UserProvider>
  </QueryClientProvider>,
);
