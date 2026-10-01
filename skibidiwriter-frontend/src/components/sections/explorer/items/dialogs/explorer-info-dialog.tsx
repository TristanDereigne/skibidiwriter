import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useExplorerItem } from "../context/use-explorer-item";

interface InfoRow {
  label: string;
  value: string;
}

interface Props {
  rows: InfoRow[];
}

export default function ExplorerInfoDialog({ rows }: Readonly<Props>) {
  const { name, infoDialog } = useExplorerItem();

  return (
    <Dialog {...infoDialog.dialogProps}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="break-all">
            Informations de "{name}"
          </DialogTitle>
        </DialogHeader>
        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
          {rows.map(({ label, value }) => (
            <div key={label} className="contents">
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="break-all">{value}</dd>
            </div>
          ))}
        </dl>
        <DialogFooter>
          <DialogClose>Fermer</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
