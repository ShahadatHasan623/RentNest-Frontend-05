import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers/Providers";
import Navbar from "@/_components/public/Navbar";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "RentNest",
  description: "Find & List Rental Properties with Ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>

            <Toaster
              richColors
              position="bottom-right"
            />
          </div>
        </Providers>
      </body>
    </html>
  );
}