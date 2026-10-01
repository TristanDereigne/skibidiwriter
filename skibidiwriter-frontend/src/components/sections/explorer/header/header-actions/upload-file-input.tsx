import type { Ref } from "react";
import { useUploadFiles } from "../../use-upload-files";

interface Props {
  ref: Ref<HTMLInputElement>;
  folderId: string | null;
}

export default function UploadFileInput({ ref, folderId }: Readonly<Props>) {
  const uploadFiles = useUploadFiles(folderId);

  return (
    <input
      ref={ref}
      type="file"
      multiple
      hidden
      onChange={(e) => {
        uploadFiles(Array.from(e.target.files ?? []));
        e.target.value = "";
      }}
    />
  );
}
