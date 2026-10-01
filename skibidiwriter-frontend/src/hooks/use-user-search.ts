import { api, errorMessage } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { UsernameSearchSchema } from "skibidiwriter-shared";

export function useUserSearch(search: string) {
  const parsed = UsernameSearchSchema.safeParse(search);
  const term = parsed.success ? parsed.data : "";

  return useQuery({
    queryKey: ["users", term],
    enabled: parsed.success,
    queryFn: async () => {
      const res = await api.users.search.$get({ query: { search: term } });
      if (!res.ok)
        throw new Error(await errorMessage(res, "Erreur lors de la recherche"));

      return await res.json();
    },
  });
}
