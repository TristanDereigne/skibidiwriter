import { toast } from "@/components/ui/toast";
import { api } from "@/lib/api";
import { saveBlob } from "@/lib/download";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const FILES_QUERY_KEY = ["files"];

export const DEFAULT_DOCUMENT_NAME = "Document sans titre";

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

export function useFile(id: string | undefined) {
  return useQuery({
    queryKey: [...FILES_QUERY_KEY, "detail", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await api.files[":id"].$get({ param: { id: id! } });
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

export function useCreateDocument() {
  const invalidate = useInvalidateFiles();

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
      const res = await api.files.documents.$post({
        json: { name, folderId, content },
      });
      if (!res.ok) throw new Error("Échec de la création du document");

      return await res.json();
    },
    onSuccess: invalidate,
  });
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
      if (!res.ok)
        throw new Error(await errorMessage(res, "Échec du téléversement"));

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
      if (!res.ok) throw new Error("Échec du renommage du fichier");

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
        throw new Error(
          await errorMessage(res, "Échec du déplacement du fichier"),
        );

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
      if (!res.ok) throw new Error("Échec de la suppression du fichier");
    },
    onSuccess: invalidate,
  });
}

function fileNameOf(res: Response) {
  const encoded = /filename\*=UTF-8''([^;]+)/.exec(
    res.headers.get("Content-Disposition") ?? "",
  )?.[1];

  return encoded ? decodeURIComponent(encoded) : "download";
}

export function useDownloadFile() {
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.files[":id"].content.$get({ param: { id } });
      if (!res.ok) throw new Error("Échec du téléchargement du fichier");

      saveBlob(await res.blob(), fileNameOf(res));
    },
    onError: (error) =>
      toast.add({
        title: "Téléchargement impossible",
        description: error.message,
        type: "error",
      }),
  });
}
