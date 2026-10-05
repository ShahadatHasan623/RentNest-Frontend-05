"use client";

import { Skeleton } from "@/components/ui/skeleton";



const LoginFormSkeleton = () => {
  return (
    <div className="w-full max-w-md rounded-2xl border border-border/70 bg-card shadow-lg shadow-black/5">
      <div className="flex flex-col items-center gap-4 p-6 pb-2">
        {/* brand icon */}
        <Skeleton className="size-14 rounded-2xl" />

        {/* title + description */}
        <div className="flex w-full flex-col items-center gap-2">
          <Skeleton className="h-7 w-44" />

          <Skeleton className="h-4 w-52" />
        </div>
      </div>

      <div className="space-y-5 p-6 pt-4">
        {/* email field */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-14" />

          <Skeleton className="h-11 w-full rounded-md" />
        </div>

        {/* password field */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />

          <Skeleton className="h-11 w-full rounded-md" />
        </div>

        {/* submit button */}
        <Skeleton className="h-11 w-full rounded-md" />
      </div>

      {/* divider */}
      <div className="flex items-center gap-3 px-6">
        <Skeleton className="h-px flex-1" />

        <Skeleton className="h-3 w-24 rounded-full" />

        <Skeleton className="h-px flex-1" />
      </div>

      {/* register CTA */}
      <div className="p-6 pt-5">
        <Skeleton className="h-11 w-full rounded-md" />

        {/* trust note */}
        <Skeleton className="mx-auto mt-5 h-3 w-56 rounded-full" />
      </div>
    </div>
  );
};

export default LoginFormSkeleton;