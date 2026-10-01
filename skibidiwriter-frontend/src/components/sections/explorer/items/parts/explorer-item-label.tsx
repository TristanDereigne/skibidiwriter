import InlineNameInput from "@/components/shared/inline-name-input";
import { useExplorerItem } from "../context/use-explorer-item";

interface Props {
  nameLabel: string;
  subtitle: string;
  onOpen: () => void;
  onRename: (name: string) => void;
}

export default function ExplorerItemLabel({
  nameLabel,
  subtitle,
  onOpen,
  onRename,
}: Readonly<Props>) {
  const { name, isRenaming, stopRenaming } = useExplorerItem();

  return (
    <div className="w-full">
      {isRenaming ? (
        <InlineNameInput
          className="text-center"
          name={name}
          label={nameLabel}
          onCommit={onRename}
          onDone={stopRenaming}
        />
      ) : (
        <button
          type="button"
          className="block w-full truncate rounded text-sm font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          onClick={onOpen}
        >
          {name}
        </button>
      )}
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </div>
  );
}
