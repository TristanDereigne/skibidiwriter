import { toast } from "@/components/ui/toast";
import { api, errorMessage } from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
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

export function useShareFile() {
  return useMutation({
    mutationFn: async (input: CreateFileSharesDTO) => {
      const res = await api["file-shares"].$post({ json: input });
      if (!res.ok)
        throw new Error(await errorMessage(res, "Échec du partage du fichier"));

      return await res.json();
    },
    onSuccess: () =>
      toast.add({ title: "Invitation envoyée", type: "success" }),
    onError: (error) =>
      toast.add({
        title: "Partage impossible",
        description: error.message,
        type: "error",
      }),
  });
}
