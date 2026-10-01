import { api, errorMessage } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useUserSearch(search: string) {
  return useQuery({
    queryKey: ["users", search],
    enabled: search.length > 0,
    queryFn: async () => {
      const res = await api.users.search.$get({ query: { search } });
      if (!res.ok)
        throw new Error(await errorMessage(res, "Erreur lors de la recherche"));

      return await res.json();
    },
  });
}
