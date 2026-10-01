import { useAuthContext } from "@/context/AuthContext.tsx";
import { Navigate, Outlet } from "react-router";

export default function App() {
  const { isLoggedIn, isPending } = useAuthContext();

  if (isPending) return null;
  if (!isLoggedIn) return <Navigate to="/login" replace />;

  return (
    <div className="flex h-svh flex-col">
      <Outlet />
    </div>
  );
}
