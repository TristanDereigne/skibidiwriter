import InlineNameInput from "@/components/shared/inline-name-input";

interface Props {
  name: string;
  nameLabel: string;
  subtitle: string;
  renaming: boolean;
  onOpen: () => void;
  onRename: (name: string) => void;
  onRenameDone: () => void;
}

export default function ExplorerItemLabel({
  name,
  nameLabel,
  subtitle,
  renaming,
  onOpen,
  onRename,
  onRenameDone,
}: Readonly<Props>) {
  return (
    <div className="w-full">
      {renaming ? (
        <InlineNameInput
          className="text-center"
          name={name}
          label={nameLabel}
          onCommit={onRename}
          onDone={onRenameDone}
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
