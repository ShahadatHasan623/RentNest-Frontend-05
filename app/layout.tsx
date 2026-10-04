import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers/Providers";
import Navbar from "@/_components/public/Navbar";
import { Toaster } from "sonner";
import { getMe } from "@/services/auth";

export const metadata: Metadata = {
  title: "RentNest",
  description: "Find & List Rental Properties with Ease",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const users = await getMe();
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Navbar user={users} />
            <main className="flex-1">
              {children}
            </main>

            <Toaster
              richColors
              position="top-right"
            />
          </div>
        </Providers>
      </body>
    </html>
  );
}