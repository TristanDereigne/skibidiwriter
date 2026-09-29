import { authClient } from "@/lib/auth-client";
import { createContext, useContext, useMemo } from "react";
import { useAuth } from "@/hooks/use-auth.ts";

type AuthContextType = {
  user: string | null;
  isLoggedIn: boolean;
  isPending: boolean;
  register: (email: string, password: string, pseudo: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext requires an AuthProvider");

  return context;
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();
  const { data: session, isPending } = authClient.useSession();

  const value = useMemo<AuthContextType>(
    () => ({
      user: session?.user.name ?? null,
      isLoggedIn: !!session,
      isPending,
      register: async (email, password, pseudo) => {
        await auth.signUp(email, password, pseudo);
        await auth.signIn(email, password);
      },
      login: async (email, password) => {
        await auth.signIn(email, password);
      },
      logout: async () => {
        await authClient.signOut();
      },
    }),
    [session, isPending],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
