import { api } from "@/lib/api";
import { FILES_QUERY_KEY } from "./use-files";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const FOLDERS_QUERY_KEY = ["folders"];

export const DEFAULT_FOLDER_NAME = "Nouveau dossier";

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

export function useFolderStats(id: string, enabled: boolean) {
  return useQuery({
    queryKey: [...FOLDERS_QUERY_KEY, "stats", id],
    enabled,
    queryFn: async () => {
      const res = await api.folders[":id"].stats.$get({ param: { id } });
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
      if (!res.ok) throw new Error("Échec de la création du dossier");

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
      if (!res.ok) throw new Error("Échec du renommage du dossier");

      return await res.json();
    },
    onSuccess: invalidate,
  });
}

export function useMoveFolder() {
  const invalidate = useInvalidateFolders();

  return useMutation({
    mutationFn: async ({
      id,
      parentId,
    }: {
      id: string;
      parentId: string | null;
    }) => {
      const res = await api.folders[":id"].move.$patch({
        param: { id },
        json: { parentId },
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(body?.error ?? "Échec du déplacement du dossier");
      }

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
      if (!res.ok) throw new Error("Échec de la suppression du dossier");
    },
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: FOLDERS_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: FILES_QUERY_KEY }),
      ]),
  });
}
