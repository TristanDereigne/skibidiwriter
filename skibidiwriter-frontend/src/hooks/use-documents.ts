import { toast } from "@/components/ui/toast";
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

function toFileName(name: string) {
  const safe = name.replace(/[\\/:*?"<>|\u0000-\u001f]/g, "_").trim() || "document";

  return /\.[A-Za-z0-9]{1,8}$/.test(safe) ? safe : `${safe}.md`;
}

export function useDownloadDocument() {
  return useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const res = await api.documents[":id"].content.$get({ param: { id } });
      if (!res.ok) throw new Error("Failed to download document");

      const url = URL.createObjectURL(
        new Blob([await res.text()], { type: "text/plain;charset=utf-8" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = toFileName(name);
      link.click();
      URL.revokeObjectURL(url);
    },
    onError: (error) =>
      toast.add({
        title: "Couldn’t download",
        description: error.message,
        type: "error",
      }),
  });
}

export function useMoveDocument() {
  const invalidate = useInvalidateDocuments();

  return useMutation({
    mutationFn: async ({
      id,
      folderId,
    }: {
      id: string;
      folderId: string | null;
    }) => {
      const res = await api.documents[":id"].move.$patch({
        param: { id },
        json: { folderId },
      });
      if (!res.ok) throw new Error("Failed to move document");

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
