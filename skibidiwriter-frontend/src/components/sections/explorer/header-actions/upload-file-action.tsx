import { Button } from "@/components/ui/button";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";
import { toast } from "@/components/ui/toast";
import {
  DEFAULT_DOCUMENT_NAME,
  useCreateDocument,
} from "@/hooks/use-documents";
import { UploadIcon } from "lucide-react";
import { MAX_DOCUMENT_CONTENT_LENGTH } from "skibidiwriter-shared";
import { useRef } from "react";

const MIN_UPLOAD_DURATION = 900;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function UploadProgress({ value }: Readonly<{ value: number }>) {
  return (
    <Progress value={value} className="gap-1.5">
      <ProgressLabel className="font-normal text-muted-foreground">
        Uploading…
      </ProgressLabel>
      <ProgressValue />
    </Progress>
  );
}

interface Props {
  folderId: string | null;
}

export default function UploadFileAction({ folderId }: Readonly<Props>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const createDocument = useCreateDocument();

  async function upload(file: File) {
    const id = toast.add({
      title: file.name,
      description: <UploadProgress value={0} />,
      type: "loading",
      timeout: 0,
    });

    const startedAt = Date.now();
    const setProgress = (value: number) =>
      toast.update(id, { description: <UploadProgress value={value} /> });

    try {
      if (file.size > MAX_DOCUMENT_CONTENT_LENGTH) {
        throw new Error("File too large");
      }

      const content = await file.text();
      setProgress(40);

      await createDocument.mutateAsync({
        name: file.name.trim().slice(0, 255) || DEFAULT_DOCUMENT_NAME,
        folderId,
        content,
      });
      setProgress(90);

      await sleep(Math.max(0, MIN_UPLOAD_DURATION - (Date.now() - startedAt)));
      setProgress(100);
      await sleep(250);

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
