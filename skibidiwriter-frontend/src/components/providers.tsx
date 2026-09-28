import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import { TooltipProvider } from "./ui/tooltip";

const queryClient = new QueryClient();

export default function Providers({ children }: PropsWithChildren) {
  return (
    <TooltipProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </TooltipProvider>
  );
}
