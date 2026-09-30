import { authClient } from "../lib/auth-client.ts";
import { api } from "@/lib/api.ts";
import { useMutation } from "@tanstack/react-query";

export type EnableTwoFactorResult = {
  method: "totp";
  totpURI: string;
  backupCodes: string[];
};

export type TwoFactorEnabled = {
  two_factor_enabled: boolean;
};

export type DisableTwoFactorResponse = {
  data: { status: boolean } | null;
  error: { code?: string; message?: string } | null;
};

export type VerifyResponse = {
  data: { token: string; user: any } | null;
  error: { code?: string; message?: string } | null;
};

export function useAuth() {
  const signUp = async (email: string, password: string, name: string) => {
    const { data, error } = await authClient.signUp.email({
      email: email,
      password: password,
      name: name,
    });

    if (error) {
      console.error("Erreur signup:", error);
      throw new Error(error.message);
    }

    console.log("Signup réussi:", data);
    return data;
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await authClient.signIn.email({
      email: email,
      password: password,
    });

    if (error) {
      console.error("Erreur signin:", error);
      throw new Error(error.message);
    }

    console.log("Signin réussi:", data);
    return data;
  };

  const enable2FA = async (
    password: string,
  ): Promise<EnableTwoFactorResult | undefined> => {
    const { data, error } = await authClient.twoFactor.enable({
      password: password,
      method: "totp",
    });

    if (error) {
      console.error("Error while enabling 2FA:", error);
      throw new Error(error.message);
    }

    if (data?.method === "totp") {
      console.log("2fa qrcode generated", data);
      return data;
    }
  };

  const deactivate2FA = async (password: string): Promise<boolean> => {
    const { data, error }: DisableTwoFactorResponse =
      await authClient.twoFactor.disable({
        password: password,
      });

    if (error) {
      console.error("Error while deactivating 2FA:", error);
      return false;
    }

    if (data?.status) {
      console.log("2fa deactivated", data);
      return data.status;
    } else {
      return false;
    }
  };

  const verify2FA = async (codeOTP: string): Promise<boolean> => {
    const { data, error }: VerifyResponse =
      await authClient.twoFactor.verifyTotp({
        code: codeOTP,
        trustDevice: true,
      });

    if (error) {
      console.error("Error while verifying 2FA:", error);
      return false;
    }

    if (data?.token) {
      console.log("data verify by 2fa otp", data);
      return true;
    } else {
      return false;
    }
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

  return {
    signUp,
    signIn,
    enable2FA,
    verify2FA,
    check2FAEnabled,
    deactivate2FA,
  };
}
