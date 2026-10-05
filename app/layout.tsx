// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers/Providers";
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
          {children}

          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  );
}