import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const font = Inter({
  weight: ["400", "500", "700"],
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
      <body className={`${font} antialiased`}>{children}</body>
    </html>
  );
}
