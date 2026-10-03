import { Toaster } from "sonner";
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
    
      <main className="flex-1">
        {children}
      </main>
      <Toaster richColors position="bottom-right" />
    </div>
  );
}