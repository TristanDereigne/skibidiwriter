import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { SharedFileDTO } from "skibidiwriter-shared";
import SharedFileRow from "./shared-file-row";

interface Props {
  files: SharedFileDTO[];
}

export default function SharedFileTable({ files }: Readonly<Props>) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="pl-6">Nom</TableHead>
          <TableHead className="hidden sm:table-cell">Partagé par</TableHead>
          <TableHead className="hidden md:table-cell">Partagé le</TableHead>
          <TableHead className="hidden pr-6 text-right sm:table-cell">
            Taille
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {files.map((file) => (
          <SharedFileRow key={file.id} file={file} />
        ))}
      </TableBody>
    </Table>
  );
}
