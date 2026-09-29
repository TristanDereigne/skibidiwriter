import Providers from "./components/providers";
import { Outlet } from "react-router";

export default function Public() {
  return (
    <Providers>
      <Outlet />
    </Providers>
  );
}
