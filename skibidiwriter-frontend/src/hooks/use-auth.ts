import { authClient } from "../lib/auth-client.ts";

export function useAuth() {

  const signUp = async (email: string, password: string, name: string) => {
      const { data, error } = await authClient.signUp.email({
        email: email,
        password: password,
        name: name,
      }, {
        onSuccess: (ctx) => {
          console.log("success: "+ctx.response.body);
          return ctx.data;
        },
        onError: (ctx) => {
          console.log("error: "+ctx.error.message);
          return ctx.error.message;
        },
      });

    if (error) {
      console.error("Erreur signup:", error);
      throw new Error(error.message);
    }

    console.log("Signup réussi:", data);
    return data;
  };

  return {
    signUp,
  };
}
