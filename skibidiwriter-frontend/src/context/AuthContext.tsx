import * as React from "react";
import { createContext, useState } from "react";
import {useAuth} from "@/hooks/use-auth.ts";

type AuthContextType = {
  user: string | null;
  register: (username: string, password: string, pseudo: string) => void;
  isUserLoggedin: () => boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

  const auth = useAuth();

  const [user, setUser] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const register = async (email:string, password:string, pseudo: string) => {

    await auth.signUp(email, password, pseudo).then((result) => {
      console.log("signup result",result);
    });

    setUser(pseudo);
    setIsLoggedIn(true);
  };

  const isUserLoggedin = () => {
    return isLoggedIn;
  }

  return (
    <AuthContext.Provider value={{ user, isUserLoggedin, register }}>
      {children}
    </AuthContext.Provider>
  );
};
