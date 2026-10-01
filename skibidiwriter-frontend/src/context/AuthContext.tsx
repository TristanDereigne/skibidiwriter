import {type EnableTwoFactorResult, type Login2FAResponse, useAuth} from "@/hooks/use-auth.ts";
import { authClient } from "@/lib/auth-client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useUserContext } from "@/context/UserContext.tsx";
import { formateDate } from "@/lib/utils.ts";
import { realtime } from "@/lib/realtime.ts";

type AuthContextType = {
  user: string | null;
  isLoggedIn: boolean;
  isPending: boolean;
  is2FAEnabled: boolean;
  is2FAAccount: boolean;
  setIs2FAEnabled: (is2FAEnabled: boolean) => void;
  setIs2FAAccount: (is2FAAccount: boolean) => void;
  enable2FA: (password: string) => Promise<string | undefined>;
  deactivate2FA: (password: string) => Promise<void>;
  verify2FA: (codeOTP: string) => Promise<boolean>;
  check2FAEnabled: () => void;
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

  const [is2FAEnabled, setIs2FAEnabled] = useState<boolean>(false);
  const [is2FAAccount, setIs2FAAccount] = useState<boolean>(false);

  const { data: session, isPending } = authClient.useSession();

  const check2FA = useCallback(() => {
    auth.check2FAEnabled.mutate(undefined, {
      onSuccess: (response) => {
        setIs2FAEnabled(response.two_factor_enabled);
      },
      onError: (error) => {
        console.error("Error while checking 2FA :", error);
      },
    });
  }, [auth.check2FAEnabled]);


  useEffect(() => {
    if (session?.user) {
      userContext.setUser(session?.user);
      userContext.setUsername(session?.user.name);
      userContext.setEmail(session?.user.email);
      userContext.setUserSince(formateDate(session?.user.createdAt));
      check2FA();
    }
  }, [session?.user]);

  const isLoggedIn = !!session;

  useEffect(() => {
    if (!isLoggedIn) return;

    realtime.connect();

    return () => realtime.close();
  }, [isLoggedIn]);

  const value = useMemo<AuthContextType>(
    () => ({
      user: session?.user.name ?? null,
      isLoggedIn,
      isPending,
      is2FAEnabled,
      is2FAAccount,
      setIs2FAEnabled,
      setIs2FAAccount,
      enable2FA: async (password) => {
        const response: EnableTwoFactorResult | undefined =
          await auth.enable2FA(password);
        const qrCodeUrl = response?.totpURI;
        if (qrCodeUrl) {
          return qrCodeUrl;
        } else {
          return undefined;
        }
      },
      deactivate2FA: async (password) => {
        const success = await auth.deactivate2FA(password);
        if (success) {
          check2FA();
        }
      },
      verify2FA: async (codeOTP) => {
        const success = await auth.verify2FA(codeOTP);
        if (success) {
          check2FA();
          return true;
        } else {
          return false;
        }
      },
      check2FAEnabled: check2FA,
      register: async (email, password, pseudo) => {
        await auth.signUp(email, password, pseudo);
        await auth.signIn(email, password);
      },
      login: async (email, password) => {
        const response: Login2FAResponse | any = await auth.signIn(email, password);

        if(response?.twoFactorMethods) {
          const data: Login2FAResponse = response;
          console.log("Login for 2FA:", data.twoFactorMethods);
          setIs2FAAccount(true)
        } else {
          const data: any = response.data;
          console.log("Login basic:", data);
        }

        if (session?.user.name) {
          userContext.setUsername(session?.user.name);
        }

      },
      logout: async () => {
        await authClient.signOut();
      },
    }),
    [session, isLoggedIn, isPending, auth, check2FA, is2FAEnabled, userContext],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
