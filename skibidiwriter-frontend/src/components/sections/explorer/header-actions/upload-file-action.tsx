import { Button } from "@/components/ui/button";
import { useToastManager } from "@/components/ui/toast";
import { UploadIcon } from "lucide-react";
import { useRef } from "react";

interface Props {
  folderId: string | null;
}

export default function UploadFileAction({ folderId }: Readonly<Props>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const toast = useToastManager();

  async function upload(file: File) {
    const id = toast.add({
      title: file.name,
      description: "Uploading…",
      type: "loading",
      timeout: 0,
    });

    try {
      await new Promise((r) => setTimeout(r, 1200));

      toast.update(id, {
        description: "Uploaded",
        type: "success",
        timeout: 4000,
      });
    } catch {
      toast.update(id, {
        description: "Upload failed",
        type: "error",
        timeout: 0,
        actionProps: {
          children: "Retry",
          onClick: () => {
            toast.close(id);
            upload(file);
          },
        },
      });
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="text/*"
        multiple
        hidden
        onChange={(e) => {
          Array.from(e.target.files ?? []).forEach(upload);
          e.target.value = "";
        }}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="text-muted-foreground"
        onClick={() => inputRef.current?.click()}
      >
        <UploadIcon />
      </Button>
    </>
  );
}
