// app/(public)/auth/_actions/AuthSkelton.tsx
import { Skeleton } from "@/components/ui/skeleton";

const AuthSkeleton = () => {
  return (
    <div className="w-full rounded-2xl border border-border/70 bg-card shadow-lg shadow-black/5">
      {/* header: brand icon + title + description */}
      <div className="flex flex-col items-center gap-4 p-6 pb-2">
        <Skeleton className="size-14 rounded-2xl" />

        <div className="flex w-full flex-col items-center gap-2">
          <Skeleton className="h-7 w-40" />

          <Skeleton className="h-4 w-56" />
        </div>
      </div>

      {/* fields: name, email, password */}
      <div className="space-y-5 p-6 pt-4">
        {[64, 44, 76].map((width, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-4" style={{ width: `${width}px` }} />

            <Skeleton className="h-11 w-full rounded-md" />
          </div>
        ))}

        {/* role selector — 2 cards */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />

          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-[86px] rounded-xl" />

            <Skeleton className="h-[86px] rounded-xl" />
          </div>
        </div>

        {/* submit button */}
        <Skeleton className="h-11 w-full rounded-md" />
      </div>

      {/* divider + login CTA */}
      <div className="space-y-5 px-6 pb-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-px flex-1" />

          <Skeleton className="h-3 w-40 rounded-full" />

          <Skeleton className="h-px flex-1" />
        </div>

        <Skeleton className="h-11 w-full rounded-md" />
      </div>
    </div>
  );
};

export default AuthSkeleton;