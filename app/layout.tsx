import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Direct Care Indy - DPC Membership Platform",
  description: "Direct Primary Care membership platform with transparent pricing and wholesale costs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
