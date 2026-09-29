import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import { TooltipProvider } from "./ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";

const queryClient = new QueryClient();

export default function Providers({ children }: Readonly<PropsWithChildren>) {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
