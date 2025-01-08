import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Suspense } from "react";

const font = Inter({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Moogle Park",
  description: "Google Drive Clone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${font.className} antialiased`}>
        <NuqsAdapter>
          <Suspense>{children}</Suspense>
        </NuqsAdapter>
      </body>
    </html>
  );
}
