import type { Metadata } from "next";
import { Inter, Open_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const openSans = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KSU KDD Wiki",
  description: "Wiki for the KSU KDD Research group",
  icons: ["/favicon.ico"],
  robots: {
    index: false,
    follow: false,
    nocache: true,
  }
};


import Header from "@/components/header";
import Footer from "@/components/footer";
import Script from "next/script";
import Head from "next/head";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* <Head> */}
        {/* <link rel="stylesheet" href="https://use.typekit.net/bxx1cgw.css"></link> */}
        {/* <link rel="stylesheet" href="https://use.typekit.net/qra4olf.css" /> */}
      {/* </Head> */}
      <body className={`font-ksu-fonts flex flex-col h-screen`}>
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
