import { useAuth } from "@/hooks/use-auth.ts";
import { authClient } from "@/lib/auth-client";
import { createContext, useContext, useEffect, useState } from "react";
import { useUserContext } from "@/context/UserContext.tsx";
import { formateDate } from "@/lib/utils.ts";
import { realtime } from "@/lib/realtime.ts";

type AuthContextType = {
  isLoggedIn: boolean;
  isPending: boolean;
  is2FAEnabled: boolean;
  is2FAAccount: boolean;
  isAdmin: boolean;
  setIs2FAAccount: (is2FAAccount: boolean) => void;
  enable2FA: (password: string) => Promise<string | undefined>;
  deactivate2FA: (password: string) => Promise<void>;
  verify2FA: (codeOTP: string) => Promise<boolean>;
  register: (email: string, password: string, pseudo: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext requires an AuthProvider");

  return context;
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();
  const userContext = useUserContext();

  const [is2FAEnabled, setIs2FAEnabled] = useState<boolean>(false);
  const [is2FAAccount, setIs2FAAccount] = useState<boolean>(false);

  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const { data: session, isPending } = authClient.useSession();

  const check2FA = () => {
    auth.check2FAEnabled.mutate(undefined, {
      onSuccess: (response) => {
        setIs2FAEnabled(response.two_factor_enabled);
      },
      onError: (error) => {
        console.error("Error while checking 2FA :", error);
      },
    });
  };

  useEffect(() => {
    if (session?.user) {
      userContext.setUser(session.user);
      userContext.setUsername(session.user.name);
      userContext.setEmail(session.user.email);
      userContext.setUserSince(formateDate(session.user.createdAt));
      check2FA();
    }
  }, [session?.user]);

  const isLoggedIn = !!session;

  useEffect(() => {
    if (!isLoggedIn) return;

    auth.checkIsAdmin.mutate(undefined, {
      onSuccess: (role) => {
        setIsAdmin(role === "admin");
        if (role === "admin") userContext.getUsersForAdmin();
      },
      onError: (error) => {
        console.error("Error while checking admin role:", error);
      },
    });

    realtime.connect();

    return () => realtime.close();
  }, [isLoggedIn]);

  const value: AuthContextType = {
    isLoggedIn,
    isPending,
    is2FAEnabled,
    is2FAAccount,
    isAdmin,
    setIs2FAAccount,
    enable2FA: auth.enable2FA,
    deactivate2FA: async (password) => {
      const success = await auth.deactivate2FA(password);
      if (success) check2FA();
    },
    verify2FA: async (codeOTP) => {
      const success = await auth.verify2FA(codeOTP);
      if (success) check2FA();
      return success;
    },
    register: async (email, password, pseudo) => {
      await auth.signUp(email, password, pseudo);
      await auth.signIn(email, password);
    },
    login: async (email, password) => {
      const response = await auth.signIn(email, password);

      if ("twoFactorMethods" in response && response.twoFactorMethods) {
        setIs2FAAccount(true);
      }
    },
    logout: async () => {
      setIs2FAAccount(false);
      setIs2FAEnabled(false);
      await authClient.signOut();
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
