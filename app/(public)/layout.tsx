// app/(public)/layout.tsx
import { getMe } from "@/services/auth";

import Navbar from "@/_components/public/Navbar";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getMe();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user} />

      <main className="flex-1">{children}</main>
    </div>
  );
}