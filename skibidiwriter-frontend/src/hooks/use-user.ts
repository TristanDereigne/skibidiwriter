import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api.ts";

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

  return {
    updateEmail,
  };
}
