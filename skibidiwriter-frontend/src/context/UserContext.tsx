import { createContext, useContext, useMemo, useState } from "react";
import type { User } from "better-auth";
import { useUser } from "@/hooks/use-user.ts";

type UserContextType = {
  user: User | null;
  username: string | null;
  email: string | null;
  userSince: string | null;
  setUser: (user: User | null) => void;
  setUsername: (username: string | null) => void;
  setEmail: (email: string | null) => void;
  setUserSince: (userSince: string | null) => void;
  updateEmail: (email: string) => void;
};

export const UserContext = createContext<UserContextType | null>(null);

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUserContext requires an UserProvider");
  return context;
}

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const userHook = useUser();

  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string | null>("");
  const [email, setEmail] = useState<string | null>("");
  const [userSince, setUserSince] = useState<string | null>(null);

  const updateEmail = async (email: string) => {
    userHook.updateEmail.mutate(email, {
      onSuccess: (response) => {
        if (response.email) {
          setEmail(response.email);
        }
      },
      onError: (error) => {
        console.error("Error while updating the email :", error);
      },
    });
  };

  const value = useMemo<UserContextType>(
    () => ({
      user,
      username,
      userSince,
      email,
      setUser,
      setUsername,
      setEmail,
      setUserSince,
      updateEmail,
    }),
    [
      user,
      email,
      username,
      userSince,
      setUser,
      setUsername,
      setEmail,
      setUserSince,
      updateEmail,
    ],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
