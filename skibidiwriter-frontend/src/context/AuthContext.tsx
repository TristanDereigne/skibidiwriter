import { useAuth } from "@/hooks/use-auth.ts";
import { authClient } from "@/lib/auth-client";
import {createContext, useContext, useEffect, useMemo} from "react";
import {useUserContext} from "@/context/UserContext.tsx";

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
    const userContext = useUserContext()

    const { data: session, isPending } = authClient.useSession();

    useEffect(() => {
        if(session?.user){
            userContext.setUser(session?.user);
            userContext.setUsername(session?.user.name);
        }
    }, [session?.user]);

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
        if(session?.user.name) {
            userContext.setUsername(session?.user.name)
        }
      },
      logout: async () => {
        await authClient.signOut();
      },
    }),
    [session, isPending, auth],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
