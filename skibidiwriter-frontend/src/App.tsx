import Providers from "./components/providers";
import {Outlet} from "react-router";

export default function App() {
  return (
    <Providers>
      <Outlet />
    </Providers>
  );
}
