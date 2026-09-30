import { Button } from "@/components/ui/button";
import { UploadIcon } from "lucide-react";
import { useRef } from "react";
import { useUploadFiles } from "../use-upload-files";

interface Props {
  folderId: string | null;
}

export default function UploadFileAction({ folderId }: Readonly<Props>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadFiles = useUploadFiles(folderId);

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        multiple
        hidden
        onChange={(e) => {
          uploadFiles(Array.from(e.target.files ?? []));
          e.target.value = "";
        }}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="text-muted-foreground"
        aria-label="Upload files"
        title="Upload files"
        onClick={() => inputRef.current?.click()}
      >
        <UploadIcon />
      </Button>
    </>
  );
}
