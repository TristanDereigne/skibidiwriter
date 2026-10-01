import { useSharedFiles } from "@/hooks/use-shared-files";
import SharedEmpty from "../states/shared-empty";

export default function SharedContent() {
  const sharedFiles = useSharedFiles();

  if (!sharedFiles.data?.length) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <SharedEmpty />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center">TODO</div>
  );
}
