import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api.ts";
import type { UsersDto } from "skibidiwriter-shared";

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

  return {
    updateEmail,
    getUsers,
  };
}
