import { api } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const DOCUMENTS_QUERY_KEY = ["documents"];

export const DEFAULT_DOCUMENT_NAME = "Untitled document";

export function useDocuments(folderId: string | null = null) {
  return useQuery({
    queryKey: [...DOCUMENTS_QUERY_KEY, "list", folderId],
    queryFn: async () => {
      const res = await api.documents.$get({
        query: folderId ? { folderId } : {},
      });
      if (!res.ok) return null;

      return await res.json();
    },
  });
}

export function useDocument(id: string | undefined) {
  return useQuery({
    queryKey: [...DOCUMENTS_QUERY_KEY, "detail", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await api.documents[":id"].$get({ param: { id: id! } });
      if (!res.ok) return null;

      return await res.json();
    },
  });
}

function useInvalidateDocuments() {
  const queryClient = useQueryClient();

  return () => queryClient.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEY });
}

export function useCreateDocument() {
  const invalidate = useInvalidateDocuments();

  return useMutation({
    mutationFn: async ({
      name,
      folderId,
      content,
    }: {
      name: string;
      folderId: string | null;
      content?: string;
    }) => {
      const res = await api.documents.$post({
        json: { name, folderId, content },
      });
      if (!res.ok) throw new Error("Failed to create document");

      return await res.json();
    },
    onSuccess: invalidate,
  });
}

export function useRenameDocument() {
  const invalidate = useInvalidateDocuments();

  return useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const res = await api.documents[":id"].$patch({
        param: { id },
        json: { name },
      });
      if (!res.ok) throw new Error("Failed to rename document");

      return await res.json();
    },
    onSuccess: invalidate,
  });
}

export function useDeleteDocument() {
  const invalidate = useInvalidateDocuments();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.documents[":id"].$delete({ param: { id } });
      if (!res.ok) throw new Error("Failed to delete document");
    },
    onSuccess: invalidate,
  });
}
