import type { Metadata } from "next";

import "./globals.css";


export const metadata: Metadata = {
  title: "Shopfinity",
  description: "Multi-vendor E-commerce platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
