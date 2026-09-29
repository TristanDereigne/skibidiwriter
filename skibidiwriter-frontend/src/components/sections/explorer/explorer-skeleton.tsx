import { Skeleton } from "@/components/ui/skeleton";

export default function ExplorerSkeleton() {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] gap-6">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="flex flex-col items-center gap-2">
          <Skeleton className="h-24 w-20" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ))}
    </div>
  );
}
