import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "KSU KDD Wiki",
  description: "Wiki for the KSU KDD Research group",
  icons: ["/favicon.ico"],
  robots: "noindex, nofollow",
};

import Header from "@/components/header";
import Footer from "@/components/footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className + " flex flex-col h-screen"}>
        <Header />
        <div className="grow">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
