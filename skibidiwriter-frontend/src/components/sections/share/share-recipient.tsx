import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserMinusIcon } from "lucide-react";
import type { UserSummaryDTO } from "skibidiwriter-shared";

interface Props {
  user: UserSummaryDTO;
  disabled: boolean;
  onRemove: () => void;
}

export default function ShareRecipient({
  user,
  disabled,
  onRemove,
}: Readonly<Props>) {
  return (
    <div className="flex items-center gap-3 p-1">
      <Avatar size="sm">
        <AvatarFallback>{user.name.slice(0, 1).toUpperCase()}</AvatarFallback>
      </Avatar>
      <p className="min-w-0 flex-1 truncate font-medium">{user.name}</p>
      <Button
        variant="ghost"
        size="icon-sm"
        className="text-muted-foreground"
        disabled={disabled}
        aria-label={`Retirer l'accès de ${user.name}`}
        title={`Retirer l'accès de ${user.name}`}
        onClick={onRemove}
      >
        <UserMinusIcon />
      </Button>
    </div>
  );
}
