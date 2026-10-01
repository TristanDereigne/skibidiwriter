import { toast } from "@/components/ui/toast";
import { api, errorMessage } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import type { CreateFileSharesInput } from "skibidiwriter-shared";

export function useShareFile() {
  return useMutation({
    mutationFn: async (input: CreateFileSharesInput) => {
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
