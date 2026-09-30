import { createContext, useContext, useMemo, useState } from "react";
import type { User } from "better-auth";

type UserContextType = {
  user: User | null;
  username: string | null;
  email: string | null;
  userSince: string | null;
  setUser: (user: User | null) => void;
  setUsername: (username: string | null) => void;
  setEmail: (email: string | null) => void;
  setUserSince: (userSince: string | null) => void;
};

export const UserContext = createContext<UserContextType | null>(null);

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUserContext requires an UserProvider");
  return context;
}

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string | null>("");
  const [email, setEmail] = useState<string | null>("");
  const [userSince, setUserSince] = useState<string | null>(null);

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
    ],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
