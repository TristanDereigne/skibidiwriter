import Chat from "./Chat";
import Providers from "./components/providers";
import { Toaster } from "./components/ui/toast";
import Examples from "./Examples";

export default function App() {
  return (
    <Providers>
      <Chat />
      <Examples />
      <Toaster />
    </Providers>
  );
}
