import { createContext, useContext, useMemo, useState } from "react";
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
  ) => Promise<UserWithRole | null>;
  deleteUser: (email: string) => Promise<true | null | undefined>;
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
  const [usersForAdmin, setUsersForAdmin] = useState<UsersDto[] | null>(null);

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

  const getUsersForAdmin = async () => {
    userHook.getUsers.mutate(undefined, {
      onSuccess: (response: UsersDto[]) => {
        if (response) {
          setUsersForAdmin(response);
        }
      },
      onError: (error) => {
        console.error("Error while getting users for admin :", error);
      },
    });
  };

  const createUser = async (
    email: string,
    password: string,
    name: string,
    role: "user" | "admin",
  ) => {
    const newUser: UserWithRole = await userHook.createUser(
      email,
      password,
      name,
      role,
    );
    if (newUser) {
      await getUsersForAdmin();
      return newUser;
    } else {
      return null;
    }
  };

  const deleteUser = async (email: string) => {
    if (usersForAdmin) {
      const userToDelete = usersForAdmin.find(
        (userInList) => userInList.email === email,
      );
      if (userToDelete) {
        const isDeleted: boolean = await userHook.deleteUser(userToDelete);
        if (isDeleted) {
          await getUsersForAdmin();
          return true;
        } else {
          return null;
        }
      } else {
        return null;
      }
    }
  };

  const value = useMemo<UserContextType>(
    () => ({
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
      deleteUser,
    }),
    [user, email, usersForAdmin, setUser, setEmail],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
