import { toast } from "@/components/ui/toast";
import { api } from "@/lib/api";
import { saveBlob } from "@/lib/download";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const FILES_QUERY_KEY = ["files"];

export function useFiles(folderId: string | null = null) {
  return useQuery({
    queryKey: [...FILES_QUERY_KEY, "list", folderId],
    queryFn: async () => {
      const res = await api.files.$get({
        query: folderId ? { folderId } : {},
      });
      if (!res.ok) return null;

      return await res.json();
    },
  });
}

function useInvalidateFiles() {
  const queryClient = useQueryClient();

  return () => queryClient.invalidateQueries({ queryKey: FILES_QUERY_KEY });
}

async function errorMessage(res: Response, fallback: string) {
  const body = (await res.json().catch(() => null)) as {
    error?: string;
  } | null;

  return body?.error ?? fallback;
}

export function useUploadFile() {
  const invalidate = useInvalidateFiles();

  return useMutation({
    mutationFn: async ({
      file,
      folderId,
    }: {
      file: File;
      folderId: string | null;
    }) => {
      const res = await api.files.$post({
        form: folderId ? { file, folderId } : { file },
      });
      if (!res.ok) throw new Error(await errorMessage(res, "Upload failed"));

      return await res.json();
    },
    onSuccess: invalidate,
  });
}

export function useRenameFile() {
  const invalidate = useInvalidateFiles();

  return useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const res = await api.files[":id"].$patch({
        param: { id },
        json: { name },
      });
      if (!res.ok) throw new Error("Failed to rename file");

      return await res.json();
    },
    onSuccess: invalidate,
  });
}

export function useMoveFile() {
  const invalidate = useInvalidateFiles();

  return useMutation({
    mutationFn: async ({
      id,
      folderId,
    }: {
      id: string;
      folderId: string | null;
    }) => {
      const res = await api.files[":id"].move.$patch({
        param: { id },
        json: { folderId },
      });
      if (!res.ok)
        throw new Error(await errorMessage(res, "Failed to move file"));

      return await res.json();
    },
    onSuccess: invalidate,
  });
}

export function useDeleteFile() {
  const invalidate = useInvalidateFiles();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.files[":id"].$delete({ param: { id } });
      if (!res.ok) throw new Error("Failed to delete file");
    },
    onSuccess: invalidate,
  });
}

export function useDownloadFile() {
  return useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const res = await api.files[":id"].content.$get({ param: { id } });
      if (!res.ok) throw new Error("Failed to download file");

      saveBlob(await res.blob(), name);
    },
    onError: (error) =>
      toast.add({
        title: "Couldn’t download",
        description: error.message,
        type: "error",
      }),
  });
}
