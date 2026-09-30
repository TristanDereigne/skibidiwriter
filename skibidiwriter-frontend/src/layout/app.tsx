import { useAuthContext } from "@/context/AuthContext.tsx";
import { HeaderContext } from "@/context/HeaderContext.tsx";
import AppHeader from "@/layout/app-header.tsx";
import { useContext } from "react";
import { Navigate, Outlet } from "react-router";

export default function App() {
  const { isLoggedIn, isPending } = useAuthContext();
  const headerContext = useContext(HeaderContext);

  if (isPending) return null;
  if (!isLoggedIn) return <Navigate to="/login" replace />;

  return (
    <div className="flex h-svh flex-col">
      <AppHeader actions={headerContext?.headerActions}>
        {headerContext?.headerChildren}
      </AppHeader>
      <div className="flex min-h-0 flex-1 flex-col">
        <Outlet />
      </div>
    </div>
  );
}
