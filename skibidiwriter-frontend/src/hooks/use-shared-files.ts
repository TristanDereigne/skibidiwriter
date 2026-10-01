import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const SHARED_FILES_QUERY_KEY = ["files"];

export function useSharedFiles() {
  return useQuery({
    queryKey: [...SHARED_FILES_QUERY_KEY, "list"],
    queryFn: async () => {
      const res = await api["file-shares"].$get();
      if (!res.ok) return null;

      return await res.json();
    },
  });
}
