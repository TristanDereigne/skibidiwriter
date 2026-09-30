import { Navigate, Outlet } from "react-router";
import Providers from "./components/providers";
import { Toaster } from "./components/ui/toast";
import { useContext } from "react";
import { useAuthContext } from "@/context/AuthContext.tsx";
import { HeaderContext } from "@/context/HeaderContext.tsx";
import AppHeader from "@/layout/app-header.tsx";

export default function App() {
  const { isLoggedIn, isPending } = useAuthContext();
  const headerContext = useContext(HeaderContext);

  if (isPending) return null;
  if (!isLoggedIn) return <Navigate to="/login" replace />;

  return (
    <Providers>
      <div className="flex h-svh flex-col">
        <AppHeader actions={headerContext?.headerActions}>
          {headerContext?.headerChildren}
        </AppHeader>
        <div className="flex min-h-0 flex-1 flex-col">
          <Outlet />
        </div>
      </div>
      <Toaster />
    </Providers>
  );
}
