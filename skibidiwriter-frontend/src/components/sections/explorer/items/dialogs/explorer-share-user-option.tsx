import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import type { UserSummaryDTO } from "skibidiwriter-shared";
import { useExplorerItem } from "../context/use-explorer-item";

interface Props {
  user: UserSummaryDTO;
  isSelected: boolean;
  onToggle: () => void;
}

export default function ExplorerShareUserOption({
  user,
  isSelected,
  onToggle,
}: Readonly<Props>) {
  const { name } = useExplorerItem();

  return (
    <label>
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
                isSelected && "bg-primary text-primary-foreground",
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
          <Checkbox checked={isSelected} onCheckedChange={onToggle} />
        </CardFooter>
      </Card>
    </label>
  );
}
