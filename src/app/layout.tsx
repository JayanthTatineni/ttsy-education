import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TTSY Education",
  description: "K-5 STEM lessons with student progress, TEKS-aligned practice, and admin lesson tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
