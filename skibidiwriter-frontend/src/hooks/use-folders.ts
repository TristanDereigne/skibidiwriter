import { api } from "@/lib/api";
import { DOCUMENTS_QUERY_KEY } from "./use-documents";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const FOLDERS_QUERY_KEY = ["folders"];

export const DEFAULT_FOLDER_NAME = "New folder";

export function useFolders(parentId: string | null = null) {
  return useQuery({
    queryKey: [...FOLDERS_QUERY_KEY, "list", parentId],
    queryFn: async () => {
      const res = await api.folders.$get({
        query: parentId ? { parentId } : {},
      });
      if (!res.ok) return null;

      return await res.json();
    },
  });
}

export function useFolderPath(id: string | null) {
  return useQuery({
    queryKey: [...FOLDERS_QUERY_KEY, "path", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await api.folders[":id"].path.$get({ param: { id: id! } });
      if (!res.ok) return null;

      return await res.json();
    },
  });
}

function useInvalidateFolders() {
  const queryClient = useQueryClient();

  return () => queryClient.invalidateQueries({ queryKey: FOLDERS_QUERY_KEY });
}

export function useCreateFolder() {
  const invalidate = useInvalidateFolders();

  return useMutation({
    mutationFn: async ({
      name,
      parentId,
    }: {
      name: string;
      parentId: string | null;
    }) => {
      const res = await api.folders.$post({ json: { name, parentId } });
      if (!res.ok) throw new Error("Failed to create folder");

      return await res.json();
    },
    onSuccess: invalidate,
  });
}

export function useRenameFolder() {
  const invalidate = useInvalidateFolders();

  return useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const res = await api.folders[":id"].$patch({
        param: { id },
        json: { name },
      });
      if (!res.ok) throw new Error("Failed to rename folder");

      return await res.json();
    },
    onSuccess: invalidate,
  });
}

export function useDeleteFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.folders[":id"].$delete({ param: { id } });
      if (!res.ok) throw new Error("Failed to delete folder");
    },
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: FOLDERS_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEY }),
      ]),
  });
}
