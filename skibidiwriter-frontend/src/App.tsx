import { Outlet } from "react-router";
import Chat from "./Chat";
import Providers from "./components/providers";
import { Toaster } from "./components/ui/toast";
import DocEditor from "./DocEditor";

export default function App() {
  return (
    <Providers>
      <main className="flex flex-col gap-6 p-6">
        <DocEditor />
        <Chat />
      </main>
      <Toaster />
      <Outlet />
    </Providers>
  );
}
