import { authClient } from "../lib/auth-client.ts";

export type EnableTwoFactorResult = |
    {
      method: "totp";
      totpURI: string;
      backupCodes: string[];
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

  const enable2FA = async (password: string): Promise<EnableTwoFactorResult|undefined> => {
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
  }

  const verify2FA = async (codeOTP: string): Promise<any|undefined> => {
    const { data, error } = await authClient.twoFactor.verifyTotp({
      code: codeOTP,
      trustDevice: true,
    });

    if (error) {
      console.error("Error while verifying 2FA:", error);
      throw new Error(error.message);
    }

    if (data) {
      console.log("data verify by 2fa otp", data);
      return data;
    }
  }


  return {
    signUp,
    signIn,
    enable2FA,
    verify2FA
  };
}
