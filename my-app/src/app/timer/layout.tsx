import type { Metadata } from "next";
import localFont from 'next/font/local';
import "./globals.css";

const inter = localFont({
  src: './fonts/inter-var.woff2',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Focus Timer",
  description: "A customizable focus timer for enhanced productivity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans`}>{children}</body>
    </html>
  );
}