import { dateTimeFormat, formatBytes } from "@/lib/format";
import type { FileDTO } from "skibidiwriter-shared";
import ExplorerInfoDialog from "./explorer-info-dialog";

interface Props {
  file: FileDTO;
  typeLabel: string;
}

export default function ExplorerFileInfoDialog({
  file,
  typeLabel,
}: Readonly<Props>) {
  return (
    <ExplorerInfoDialog
      rows={[
        { label: "Type", value: typeLabel },
        { label: "Format", value: file.mimeType },
        { label: "Taille", value: formatBytes(file.sizeBytes) },
        {
          label: "Créé le",
          value: dateTimeFormat.format(new Date(file.createdAt)),
        },
        {
          label: "Modifié le",
          value: dateTimeFormat.format(new Date(file.updatedAt)),
        },
        { label: "Modifié par", value: file.lastModifiedBy?.name ?? "Inconnu" },
      ]}
    />
  );
}
