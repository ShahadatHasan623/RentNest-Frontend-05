import { Skeleton } from "@/components/ui/skeleton";

export default function PropertyCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border">
      <Skeleton className="h-56 w-full" />

      <div className="space-y-4 p-5">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />

        <div className="flex justify-between">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    </div>
  );
}