import { Skeleton } from "@/components/ui/skeleton";

export default function SharedSkeleton() {
  return (
    <div className="divide-y">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="flex items-center gap-4 px-6 py-3">
          <Skeleton className="size-6" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="ml-auto h-4 w-24" />
        </div>
      ))}
    </div>
  );
}
