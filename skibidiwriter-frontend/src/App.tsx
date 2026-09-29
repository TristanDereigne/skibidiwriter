import Chat from "./Chat";
import Providers from "./components/providers";
import { Toaster } from "./components/ui/toast";
import DocEditor from "./DocEditor";
import Examples from "./Examples";

export default function App() {
  return (
    <Providers>
      <DocEditor />
      <Chat />
      <Examples />
      <Toaster />
    </Providers>
  );
}
