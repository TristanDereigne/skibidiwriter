import {type EnableTwoFactorResult, useAuth} from "@/hooks/use-auth.ts";
import { authClient } from "@/lib/auth-client";
import { createContext, useContext, useEffect, useMemo } from "react";
import { useUserContext } from "@/context/UserContext.tsx";
import { formateDate } from "@/lib/utils.ts";

type AuthContextType = {
  user: string | null;
  isLoggedIn: boolean;
  isPending: boolean;
  enable2FA: (password: string) => Promise<string | undefined>,
  verify2FA: (codeOTP: string) => Promise<string | undefined>,
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
  const userContext = useUserContext();

  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (session?.user) {
      userContext.setUser(session?.user);
      userContext.setUsername(session?.user.name);
    }
  }, [session?.user]);
  useEffect(() => {
    if (session?.user) {
      userContext.setUser(session?.user);
      userContext.setUsername(session?.user.name);
      userContext.setEmail(session?.user.email);
      userContext.setUserSince(formateDate(session?.user.createdAt));
    }
  }, [session?.user]);

  const value = useMemo<AuthContextType>(
    () => ({
      user: session?.user.name ?? null,
      isLoggedIn: !!session,
      isPending,
      enable2FA: async (password) => {
        const response: EnableTwoFactorResult | undefined = await auth.enable2FA(password);
        const qrCodeUrl = response?.totpURI
        if(qrCodeUrl) {
          return qrCodeUrl;
        } else {
          return undefined;
        }
      },
      verify2FA: async (codeOTP) => {
        const response: any | undefined = await auth.verify2FA(codeOTP);
        if(response){
          return response;
        }
      },
      register: async (email, password, pseudo) => {
        await auth.signUp(email, password, pseudo);
        await auth.signIn(email, password);
      },
      login: async (email, password) => {
        await auth.signIn(email, password);
        if (session?.user.name) {
          userContext.setUsername(session?.user.name);
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
