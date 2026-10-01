import { FileIcon, FileTextIcon } from "lucide-react";

export const FILE_KIND_VIEW = {
  document: {
    icon: FileTextIcon,
    iconClassName: "fill-primary/15 text-primary",
    noun: "document",
    typeLabel: "Document",
    nameLabel: "Nom du document",
  },
  upload: {
    icon: FileIcon,
    iconClassName: "fill-muted-foreground/10 text-muted-foreground",
    noun: "fichier",
    typeLabel: "Fichier",
    nameLabel: "Nom du fichier",
  },
} as const;
