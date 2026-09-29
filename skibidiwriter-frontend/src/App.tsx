import { Outlet } from "react-router";
import Providers from "./components/providers";
import { Toaster } from "./components/ui/toast";

export default function App() {
  return (
    <Providers>
      <Outlet />
      <Toaster />
    </Providers>
  );
}
