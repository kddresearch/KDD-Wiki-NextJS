import type { Metadata } from "next";
import { Inter } from "next/font/google";
// const inter = await import("next/font/google").then((mod) => mod.Inter({ subsets: ["latin"] }));
// import { Inter } from 'next/font/google'; 
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
import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className + " flex flex-col h-screen"}>
      {/* <body className={" flex flex-col h-screen"}> */}
        <Script type="text/javascript" id="MS Clarity">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "m3vxml3rsh");
          `}
        </Script>
        <Header />
        <div className="grow">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
