import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api.ts";
import type { UsersDto } from "skibidiwriter-shared";
import { authClient } from "@/lib/auth-client.ts";

export function useUser() {
  const updateEmail = useMutation({
    mutationFn: async (newEmail: string) => {
      const response = await api.users.email.$post({
        json: { email: newEmail },
      });

      if (!response.ok) {
        throw new Error("Error while updating email");
      }

      return await response.json();
    },
  });

  const getUsers = useMutation({
    mutationFn: async (): Promise<UsersDto[]> => {
      const response = await api.users.users.$get();

      if (!response.ok) {
        throw new Error("Error while getting users");
      }

      return (await response.json()) as UsersDto[];
    },
  });

  const createUser = async (
    email: string,
    password: string,
    name: string,
    role: "user" | "admin" | ("user" | "admin")[] | undefined,
  ) => {
    const { data: newUser, error } = await authClient.admin.createUser({
      email: email,
      password: password,
      name: name,
      role: role,
    });

    if (error) {
      console.error("Erreur signin:", error);
      throw new Error(error.message);
    }

    return newUser.user;
  };

  const deleteUser = async (userEmail): Promise<boolean> => {
    const { data: deletedUser, error } = await authClient.admin.removeUser({
      userId: "user-id",
    });

    if (error) {
      console.error("Erreur signin:", error);
      throw new Error(error.message);
    }

    return true;
  };

  return {
    updateEmail,
    getUsers,
    createUser,
  };
}
