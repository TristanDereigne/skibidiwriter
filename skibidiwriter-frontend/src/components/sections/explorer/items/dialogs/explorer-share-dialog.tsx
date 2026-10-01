import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDebounced } from "@/hooks/use-debounched";
import { useShareFile } from "@/hooks/use-file-shares";
import { api, errorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { useState } from "react";
import type { UserSummaryDTO } from "skibidiwriter-shared";
import { useExplorerItem } from "../context/use-explorer-item";

interface Props {
  fileId: string;
}

export default function ExplorerShareDialog({ fileId }: Readonly<Props>) {
  const { shareDialog } = useExplorerItem();

  return <ShareDialog key={shareDialog.isOpen.toString()} fileId={fileId} />;
}

function ShareDialog({ fileId }: Readonly<Props>) {
  const { name, shareDialog } = useExplorerItem();
  const shareFile = useShareFile();
  const [search, setSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<UserSummaryDTO[]>([]);

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

  const selectedIds = new Set(selectedUsers.map((u) => u.id));
  const shownUsers = [
    ...selectedUsers,
    ...users.filter((u) => !selectedIds.has(u.id)),
  ];

  const handleShare = () =>
    shareFile.mutate(
      { fileId, userIds: selectedUsers.map((u) => u.id) },
      { onSuccess: shareDialog.close },
    );

  const toggleUser = (user: UserSummaryDTO) =>
    setSelectedUsers((prev) =>
      prev.some((u) => u.id === user.id)
        ? prev.filter((u) => u.id !== user.id)
        : [...prev, user],
    );

  return (
    <Dialog {...shareDialog.dialogProps}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="break-all">Partager "{name}"</DialogTitle>
        </DialogHeader>

        <Field>
          <FieldLabel>Partager avec</FieldLabel>
          <Input
            placeholder="Nom d'utilisateur"
            onChange={(ev) => onSearchChange(ev.target.value)}
          />
        </Field>

        {shownUsers.length > 0 && (
          <ScrollArea className="*:data-[slot=scroll-area-viewport]:max-h-72">
            <div className="flex flex-col gap-2 p-1">
              {shownUsers.map((user) => {
                const isSelected = selectedIds.has(user.id);

                return (
                  <label key={user.id}>
                    <Card
                      className={cn(
                        "flex-row gap-5 items-center p-2 cursor-pointer transition-colors",
                        isSelected
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "hover:bg-muted/50",
                      )}
                    >
                      <CardHeader className="px-3">
                        <Avatar className="size-10">
                          <AvatarFallback
                            className={cn(
                              "transition-colors",
                              isSelected &&
                                "bg-primary text-primary-foreground",
                            )}
                          >
                            {isSelected ? (
                              <Check className="size-5" />
                            ) : (
                              user.name.slice(0, 1).toUpperCase()
                            )}
                          </AvatarFallback>
                        </Avatar>
                      </CardHeader>
                      <CardContent className="w-full">
                        <div className="flex flex-col gap-1">
                          <p className="font-semibold">{user.name}</p>
                          <p className="text-muted-foreground">
                            Partager "{name}" avec {user.name}
                          </p>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleUser(user)}
                        />
                      </CardFooter>
                    </Card>
                  </label>
                );
              })}
            </div>
          </ScrollArea>
        )}

        <DialogFooter>
          <DialogClose>Fermer</DialogClose>
          <Button
            disabled={!selectedUsers.length || shareFile.isPending}
            onClick={handleShare}
          >
            {selectedUsers.length
              ? `Partager avec ${selectedUsers.length} utilisateur${selectedUsers.length > 1 ? "s" : ""}`
              : "Partager"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
