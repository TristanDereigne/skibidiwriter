import { authClient } from "../lib/auth-client.ts";

export function useAuth() {
  const signUp = async (email: string, password: string, name: string) => {
    const { data, error } = await authClient.signUp.email({
      email: email,
      password: password,
      name: name,
    });
    console.log("data : " + data);
    console.log("error : " + error);
    return data;
  };

  return {
    signUp,
  };
}
