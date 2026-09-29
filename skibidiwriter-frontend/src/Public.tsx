import Providers from "./components/providers";
import { Navigate, Outlet } from "react-router";
import { useAuthContext } from "@/context/AuthContext.tsx";
import { Toaster } from "@/components/ui/toast.tsx";

export default function Public() {
  const { isLoggedIn, isPending } = useAuthContext();

  if (isPending) return null;
  if (isLoggedIn) return <Navigate to="/" replace />;

  return (
    <Providers>
      <Outlet />
      <Toaster />
    </Providers>
  );
}
