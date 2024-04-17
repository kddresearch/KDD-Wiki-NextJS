import Breadcrumb from "@/components/breadcrumb";
import AboutUs from "@/components/home/about-us";
import Announcements from "@/components/home/AnnouncementComponent";
import BackDrop from "@/components/page/backdrop";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "KSU KDD Wiki",
  description: "A simple hello world page",
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen relative">
      <div className="h-128 bg-gradient-to-r from-blue-500">
        <div className="h-128 bg-cover bg-[url('/images/placeholder.jpeg')]"></div>
      </div>
      {/* <BackDrop image="/images/placeholder.jpeg"/> */}
      <BackDrop>
        <Announcements />
        <AboutUs />
      </BackDrop>
    </div>
  );
}
