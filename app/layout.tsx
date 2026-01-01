import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Direct Care Indy - DPC Membership Platform",
  description: "Direct Primary Care membership platform with transparent pricing and wholesale costs",
  openGraph: {
    title: "Direct Care Indy - Direct Primary Care Membership",
    description: "Transparent, affordable healthcare with age-based pricing and wholesale medication costs. Experience the 90/10 model - covering 90% of your healthcare needs.",
    type: "website",
    siteName: "Direct Care Indy",
  },
  twitter: {
    card: "summary_large_image",
    title: "Direct Care Indy - DPC Membership Platform",
    description: "Transparent, affordable healthcare with age-based pricing and wholesale medication costs.",
  },
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
