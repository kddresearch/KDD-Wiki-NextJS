import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import '@/app/lib/db';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KSU KDD Wiki",
  description: "Wiki for the KSU KDD Research group",
  icons: [
    'https://www.k-state.edu/favicon.ico'
  ],
};

import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Head from "next/head";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className + " flex flex-col h-screen"}>
        <Header />
        <div className="grow">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}