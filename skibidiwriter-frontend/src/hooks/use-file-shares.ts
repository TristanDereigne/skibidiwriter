import { toast } from "@/components/ui/toast";
import { api, errorMessage } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateFileSharesDTO } from "skibidiwriter-shared";

export function useSharedFiles() {
  return useQuery({
    queryKey: ["file-shares", "received"],
    queryFn: async () => {
      const res = await api["file-shares"].$get();
      if (!res.ok)
        throw new Error(
          await errorMessage(res, "Échec du chargement des fichiers partagés"),
        );

      return await res.json();
    },
  });
}

const recipientsKey = (fileId: string) => ["file-shares", "recipients", fileId];

export function useFileRecipients(fileId: string, enabled: boolean) {
  return useQuery({
    queryKey: recipientsKey(fileId),
    enabled,
    queryFn: async () => {
      const res = await api["file-shares"][":id"].$get({
        param: { id: fileId },
      });
      if (!res.ok)
        throw new Error(
          await errorMessage(res, "Échec du chargement des partages"),
        );

      return await res.json();
    },
  });
}

export function useRevokeFileShare(fileId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const res = await api["file-shares"][":id"][":userId"].$delete({
        param: { id: fileId, userId },
      });
      if (!res.ok)
        throw new Error(await errorMessage(res, "Échec du retrait de l'accès"));
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: recipientsKey(fileId) }),
    onError: (error) =>
      toast.add({
        title: "Retrait impossible",
        description: error.message,
        type: "error",
      }),
  });
}

export function useShareFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateFileSharesDTO) => {
      const res = await api["file-shares"].$post({ json: input });
      if (!res.ok)
        throw new Error(await errorMessage(res, "Échec du partage du fichier"));

      return await res.json();
    },
    onSuccess: (_, { fileId }) => {
      toast.add({ title: "Invitation envoyée", type: "success" });
      queryClient.invalidateQueries({ queryKey: recipientsKey(fileId) });
    },
    onError: (error) =>
      toast.add({
        title: "Partage impossible",
        description: error.message,
        type: "error",
      }),
  });
}
