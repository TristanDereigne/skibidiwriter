import { api } from "@/lib/api.ts";
import { authClient } from "@/lib/auth-client.ts";
import { useMutation } from "@tanstack/react-query";

type TwoFactorEnabled = {
  two_factor_enabled: boolean;
};

type IsAdminResponse = {
  role: "user" | "admin";
};

export function useAuth() {
  const signUp = async (email: string, password: string, name: string) => {
    const { data, error } = await authClient.signUp.email({
      email,
      password,
      name,
    });

    if (error) throw new Error(error.message);

    return data;
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await authClient.signIn.email({ email, password });

    if (error) throw new Error(error.message);

    return data;
  };

  const enable2FA = async (password: string) => {
    const { data, error } = await authClient.twoFactor.enable({
      password,
      method: "totp",
    });

    if (error) throw new Error(error.message);

    return data?.method === "totp" ? data.totpURI : undefined;
  };

  const deactivate2FA = async (password: string) => {
    const { data, error } = await authClient.twoFactor.disable({ password });

    if (error) {
      console.error("Error while deactivating 2FA:", error);
      return false;
    }

    return !!data?.status;
  };

  const verify2FA = async (codeOTP: string) => {
    const { data, error } = await authClient.twoFactor.verifyTotp({
      code: codeOTP,
      trustDevice: false,
    });

    if (error) {
      console.error("Error while verifying 2FA:", error);
      return false;
    }

    return !!data?.token;
  };

  const check2FAEnabled = useMutation({
    mutationFn: async (): Promise<TwoFactorEnabled> => {
      const response = await api.users.authtwofactor.$get();

      if (!response.ok) {
        throw new Error("Error while checking 2fa enabled");
      }

      return await response.json();
    },
  });

  const checkIsAdmin = useMutation({
    mutationFn: async (): Promise<IsAdminResponse["role"]> => {
      const response = await api.users.admin.$get();

      if (!response.ok) {
        throw new Error("Error while checking if admin");
      }

      const data = (await response.json()) as IsAdminResponse;

      return data.role;
    },
  });

  return {
    signUp,
    signIn,
    enable2FA,
    verify2FA,
    check2FAEnabled,
    deactivate2FA,
    checkIsAdmin,
  };
}
