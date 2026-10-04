"use client";

import { Button } from "@/components/ui/button";

const ErrorPage = ({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <h2 className="text-2xl font-bold">
        Something went wrong!
      </h2>

      <p className="mt-2 text-muted-foreground">
        We couldn&rsquo;t load the properties.
      </p>

      <Button onClick={() => reset()} className="mt-6">
        Try Again
      </Button>
    </div>
  );
};

export default ErrorPage;