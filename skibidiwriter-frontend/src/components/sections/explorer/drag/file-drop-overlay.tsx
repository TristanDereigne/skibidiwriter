import { cn } from "cn";
import { UploadCloudIcon } from "lucide-react";

interface Props {
  isActive: boolean;
}

export default function FileDropOverlay({ isActive }: Readonly<Props>) {
  return (
    <div
      aria-hidden={!isActive}
      className={cn(
        "pointer-events-none absolute inset-3 flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary bg-background/80 text-primary opacity-0 backdrop-blur-sm transition-opacity duration-150",
        isActive && "opacity-100",
      )}
    >
      <UploadCloudIcon className="size-10" />
      <p className="text-sm font-medium">
        Déposez des fichiers pour les téléverser
      </p>
    </div>
  );
}
