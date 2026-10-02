import { useReplaceFile } from "@/hooks/use-files";
import type { Ref } from "react";

interface Props {
  ref: Ref<HTMLInputElement>;
  fileId: string;
}

export default function ExplorerReplaceInput({ ref, fileId }: Readonly<Props>) {
  const { mutate: replaceFile } = useReplaceFile();

  return (
    <input
      ref={ref}
      type="file"
      hidden
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) replaceFile({ id: fileId, file });
        e.target.value = "";
      }}
    />
  );
}
