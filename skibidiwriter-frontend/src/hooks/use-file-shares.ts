import { toast } from "@/components/ui/toast";
import { api, unwrap } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateFileSharesDTO } from "skibidiwriter-shared";

export const RECEIVED_SHARES_QUERY_KEY = ["file-shares", "received"];

export function useSharedFiles() {
  return useQuery({
    queryKey: RECEIVED_SHARES_QUERY_KEY,
    queryFn: async () => {
      const res = await unwrap(
        api["file-shares"].$get(),
        "Échec du chargement des fichiers partagés",
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
      const res = await unwrap(
        api["file-shares"][":id"].$get({
          param: { id: fileId },
        }),
        "Échec du chargement des partages",
      );

      return await res.json();
    },
  });
}

export function useRevokeFileShare(fileId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      await unwrap(
        api["file-shares"][":id"][":userId"].$delete({
          param: { id: fileId, userId },
        }),
        "Échec du retrait de l'accès",
      );
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
      const res = await unwrap(
        api["file-shares"].$post({ json: input }),
        "Échec du partage du fichier",
      );

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
