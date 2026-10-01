import { Button } from "@/components/ui/button";
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
import { useUserSearch } from "@/hooks/use-user-search";
import { useState } from "react";
import type { UserSummaryDTO } from "skibidiwriter-shared";
import { useExplorerItem } from "../context/use-explorer-item";
import ExplorerShareUserOption from "./explorer-share-user-option";

interface Props {
  fileId: string;
}

export default function ExplorerShareDialog({ fileId }: Readonly<Props>) {
  const { name, shareDialog } = useExplorerItem();
  const shareFile = useShareFile();
  const [search, setSearch] = useState("");
  const [inputKey, setInputKey] = useState(0);
  const [selectedUsers, setSelectedUsers] = useState<UserSummaryDTO[]>([]);
  const { data: users = [] } = useUserSearch(search);

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

  const reset = (isOpen: boolean) => {
    if (isOpen) return;

    setSearch("");
    setInputKey((key) => key + 1);
    setSelectedUsers([]);
  };

  return (
    <Dialog {...shareDialog.dialogProps} onOpenChangeComplete={reset}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="break-all">Partager "{name}"</DialogTitle>
        </DialogHeader>

        <Field>
          <FieldLabel>Partager avec</FieldLabel>
          <Input
            key={inputKey}
            placeholder="Nom d'utilisateur"
            onChange={(ev) => onSearchChange(ev.target.value)}
          />
        </Field>

        {shownUsers.length > 0 && (
          <ScrollArea className="*:data-[slot=scroll-area-viewport]:max-h-72">
            <div className="flex flex-col gap-2 p-1">
              {shownUsers.map((user) => (
                <ExplorerShareUserOption
                  key={user.id}
                  user={user}
                  isSelected={selectedIds.has(user.id)}
                  onToggle={() => toggleUser(user)}
                />
              ))}
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
