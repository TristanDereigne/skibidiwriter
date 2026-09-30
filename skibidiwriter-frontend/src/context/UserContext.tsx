import { createContext, useContext, useMemo, useState } from "react";
import type { User } from "better-auth";

type UserContextType = {
  user: User | null;
  username: string | null;
  setUser: (user: User | null) => void;
  setUsername: (username: string | null) => void;
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

  const value = useMemo<UserContextType>(
    () => ({
      user,
      username,
      setUser,
      setUsername,
    }),
    [user, setUser],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
