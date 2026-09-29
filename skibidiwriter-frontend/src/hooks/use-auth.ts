import { authClient } from "../lib/auth-client.ts";

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

  return {
    signUp,
    signIn,
  };
}
