import * as React from "react";
import { createContext, useState } from "react";
import {useAuth} from "@/hooks/use-auth.ts";

type AuthContextType = {
  user: string | null;
  register: (username: string, password: string, pseudo: string) => void;
  login: (username: string, password: string) => void;
  isUserLoggedin: () => boolean;
  isLoggedIn: boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

  const auth = useAuth();

  const [user, setUser] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const register = async (email:string, password:string, pseudo: string) => {
    try {
      const signUpResult = await auth.signUp(email, password, pseudo)
      if(signUpResult) {
        const signInResult = await auth.signIn(email, password);
        if (signInResult) {
          setUser(signInResult.user.name);
          setIsLoggedIn(true);
        }
      }
    } catch (error) {
      console.error("Failed to register :", error.message);
      setUser(null);
      setIsLoggedIn(false);
      throw error;
    }
  };

  const login = async (email:string, password:string) => {
    try {
      const signInResult = await auth.signIn(email, password)
      if(signInResult) {
          setUser(signInResult.user.name);
          setIsLoggedIn(true);
      }
    } catch (error) {
      console.error("Failed to login :", error.message);
      setUser(null);
      setIsLoggedIn(false);
      throw error;
    }
  };

  const isUserLoggedin = () => {
    return isLoggedIn;
  }

  return (
    <AuthContext.Provider value={{ user, isUserLoggedin, register, login, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};
