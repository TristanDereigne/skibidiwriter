import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";
import { toast } from "@/components/ui/toast";
import {
  DEFAULT_DOCUMENT_NAME,
  useCreateDocument,
  useUploadFile,
} from "@/hooks/use-files";
import {
  MAX_DOCUMENT_CONTENT_LENGTH,
  MAX_FILE_SIZE_BYTES,
} from "skibidiwriter-shared";

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

function isTextFile(file: File) {
  return (
    file.type.startsWith("text/") || /\.(md|markdown|txt)$/i.test(file.name)
  );
}

export function useUploadFiles(folderId: string | null) {
  const { mutateAsync: createDocument } = useCreateDocument();
  const { mutateAsync: uploadFile } = useUploadFile();

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
      if (file.size > MAX_FILE_SIZE_BYTES)
        throw new Error(
          `File too large (max ${MAX_FILE_SIZE_BYTES / (1024 * 1024)} MB)`,
        );

      if (isTextFile(file) && file.size <= MAX_DOCUMENT_CONTENT_LENGTH) {
        const content = await file.text();
        setProgress(40);

        await createDocument({
          name: file.name.trim().slice(0, 255) || DEFAULT_DOCUMENT_NAME,
          folderId,
          content,
        });
      } else {
        setProgress(40);
        await uploadFile({ file, folderId });
      }
      setProgress(90);

      await sleep(Math.max(0, MIN_UPLOAD_DURATION - (Date.now() - startedAt)));
      setProgress(100);
      await sleep(250);

      toast.update(id, {
        description: "Uploaded",
        type: "success",
        timeout: 4000,
      });
    } catch (error) {
      toast.update(id, {
        description: error instanceof Error ? error.message : "Upload failed",
        type: "error",
        timeout: 0,
        actionProps: {
          children: "Retry",
          onClick: () => {
            toast.close(id);
            void upload(file);
          },
        },
      });
    }
  }

  return (files: Iterable<File>) => {
    for (const file of files) void upload(file);
  };
}
