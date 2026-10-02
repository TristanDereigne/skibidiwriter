import { createContext, useContext, useState } from "react";
import type { User } from "better-auth";
import { useUser } from "@/hooks/use-user.ts";

import { type UsersDto } from "skibidiwriter-shared";
import type { UserWithRole } from "better-auth/client/plugins";

type UserContextType = {
  user: User | null;
  username: string | null;
  email: string | null;
  userSince: string | null;
  usersForAdmin: UsersDto[] | null;
  setUsersForAdmin: (users: UsersDto[] | null) => void;
  setUser: (user: User | null) => void;
  setUsername: (username: string | null) => void;
  setEmail: (email: string | null) => void;
  setUserSince: (userSince: string | null) => void;
  updateEmail: (email: string) => void;
  getUsersForAdmin: () => void;
  createUser: (
    email: string,
    password: string,
    name: string,
    role: "user" | "admin",
  ) => Promise<UserWithRole>;
  deleteUser: (email: string) => Promise<boolean>;
  banUser: (email: string, reason: string) => Promise<boolean>;
  unbanUser: (email: string) => Promise<boolean>;
};

const UserContext = createContext<UserContextType | null>(null);

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
  const [usersForAdmin, setUsersForAdmin] = useState<UsersDto[] | null>(null);

  const updateEmail = (newEmail: string) => {
    userHook.updateEmail.mutate(newEmail, {
      onSuccess: (response) => setEmail(response.email),
      onError: (error) => {
        console.error("Error while updating the email :", error);
      },
    });
  };

  const getUsersForAdmin = () => {
    userHook.getUsers.mutate(undefined, {
      onSuccess: setUsersForAdmin,
      onError: (error) => {
        console.error("Error while getting users for admin :", error);
      },
    });
  };

  const createUser: UserContextType["createUser"] = async (
    email,
    password,
    name,
    role,
  ) => {
    const newUser = await userHook.createUser(email, password, name, role);
    getUsersForAdmin();
    return newUser;
  };

  const actOnUser = async (
    email: string,
    action: (target: UsersDto) => Promise<void>,
  ) => {
    const target = usersForAdmin?.find((member) => member.email === email);
    if (!target) return false;

    await action(target);
    getUsersForAdmin();
    return true;
  };

  const value: UserContextType = {
    user,
    username,
    userSince,
    email,
    usersForAdmin,
    setUsersForAdmin,
    setUser,
    setUsername,
    setEmail,
    setUserSince,
    updateEmail,
    getUsersForAdmin,
    createUser,
    deleteUser: (email) => actOnUser(email, userHook.deleteUser),
    banUser: (email, reason) =>
      actOnUser(email, (target) => userHook.banUser(target, reason)),
    unbanUser: (email) => actOnUser(email, userHook.unbanUser),
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
