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
        </Providers>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 5000,
            style: {
              background: '#10B981', // Tailwind green-500 or any green hex code
              color: '#ffffff',      // Text color white
            },
          }}
        />
      </body>
    </html>
  );
}