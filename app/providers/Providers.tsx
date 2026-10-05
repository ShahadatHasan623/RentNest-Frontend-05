"use client";

// ...existing imports (Redux, Session, etc.)

import { TooltipProvider } from "@/components/ui/tooltip";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <TooltipProvider delayDuration={0}>
      {/* ...existing providers... */}

      {children}

      {/* ...existing providers... */}
    </TooltipProvider>
  );
};

export default Providers;