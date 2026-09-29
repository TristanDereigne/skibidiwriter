import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import { ToastProvider } from "./ui/toast";
import { TooltipProvider } from "./ui/tooltip";

const queryClient = new QueryClient();

export default function Providers({ children }: Readonly<PropsWithChildren>) {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <ToastProvider>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </ToastProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
