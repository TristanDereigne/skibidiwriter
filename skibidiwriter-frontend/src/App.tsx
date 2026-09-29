import { Navigate, Outlet } from "react-router";
import Providers from "./components/providers";
import { Toaster } from "./components/ui/toast";
import { useAuthContext } from "@/context/AuthContext.tsx";

export default function App() {
  const { isLoggedIn, isPending } = useAuthContext();

  if (isPending) return null;
  if (!isLoggedIn) return <Navigate to="/login" replace />;

  return (
    <Providers>
      <Outlet />
      <Toaster />
    </Providers>
  );
}
