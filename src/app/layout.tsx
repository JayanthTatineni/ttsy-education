import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "TTSY Education",
  description: "K-5 STEM lessons with student progress, TEKS-aligned practice, and admin lesson tools.",
};

const themeInitScript = `
  try {
    var savedTheme = localStorage.getItem("ttsy-theme");
    document.documentElement.dataset.theme = savedTheme === "dark" ? "dark" : "light";
  } catch (error) {
    document.documentElement.dataset.theme = "light";
  }
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        {children}
      </body>
    </html>
  );
}
