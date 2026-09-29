import { api } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const DOCUMENTS_QUERY_KEY = ["documents.list"];

export const DEFAULT_DOCUMENT_NAME = "Untitled document";

export function useDocuments() {
  return useQuery({
    queryKey: DOCUMENTS_QUERY_KEY,
    queryFn: async () => {
      const res = await api.documents.$get();
      if (!res.ok) return null;

      return await res.json();
    },
  });
}

export function useCreateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      const res = await api.documents.$post({ json: { name } });
      if (!res.ok) throw new Error("Failed to create document");

      return await res.json();
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEY }),
  });
}
