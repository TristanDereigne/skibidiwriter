import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useDebounced } from "@/hooks/use-debounched";
import { api, errorMessage } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export interface InfoRow {
  label: string;
  value: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fileName: string;
}

export default function ExplorerShareDialog({
  open,
  onOpenChange,
  fileName,
}: Readonly<Props>) {
  const [search, setSearch] = useState("");

  const { data: users = [] } = useQuery({
    queryKey: ["users", search],
    queryFn: async () => {
      const res = await api.users.search.$get({ query: { search } });
      if (!res.ok)
        throw new Error(await errorMessage(res, "Erreur lors de la recherche"));

      return await res.json();
    },
    enabled: search.length > 0,
  });

  const onSearchChange = useDebounced(setSearch, 300);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="break-all">Partager "{fileName}"</DialogTitle>
        </DialogHeader>

        <Field>
          <FieldLabel>Partager avec</FieldLabel>
          <Input
            placeholder="Nom d'utilisateur"
            onChange={(ev) => onSearchChange(ev.target.value)}
          />
        </Field>

        {users.map((user) => (
          <Card key={user.name} className="flex-row gap-3 items-center">
            <CardHeader>
              <Avatar className="size-10">
                <AvatarFallback>
                  {user.name.slice(0, 1).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-1">
                <p className="font-semibold">{user.name}</p>
                <p className="text-muted-foreground">
                  Partager "{fileName}" avec {user.name}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}

        <DialogFooter>
          <DialogClose>Fermer</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
