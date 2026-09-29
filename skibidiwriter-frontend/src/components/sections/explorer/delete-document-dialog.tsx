import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteDocument } from "@/hooks/use-documents";
import type { DocumentDTO } from "skibidiwriter-shared";

interface Props {
  document: DocumentDTO;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteDocumentDialog({
  document,
  open,
  onOpenChange,
}: Readonly<Props>) {
  const deleteDocument = useDeleteDocument();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete “{document.name}”?</AlertDialogTitle>
          <AlertDialogDescription>
            This document will be permanently deleted. This can’t be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={deleteDocument.isPending}
            onClick={() => deleteDocument.mutate(document.id)}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
