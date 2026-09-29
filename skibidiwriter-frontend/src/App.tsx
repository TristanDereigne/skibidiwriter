import Chat from "./Chat";
import Providers from "./components/providers";
import { Toaster } from "./components/ui/toast";
import DocEditor from "./DocEditor";
import Examples from "./Examples";

export default function App() {
  return (
    <Providers>
      <main className="flex flex-col gap-6 p-6">
        <DocEditor />
        <Chat />
        <Examples />
      </main>
      <Toaster />
    </Providers>
  );
}
