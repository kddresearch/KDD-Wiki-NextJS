
import Breadcrumb from "@/components/breadcrumb";
import AboutUs from "@/components/home/about-us";
import Announcements from "@/components/home/AnnouncementComponent";
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
        <div className="h-128 bg-cover bg-[url('/Placeholder.jpeg')]"></div>
      </div>
      <div className="bg-white min-h-fit grow text-black bg-stripe">
        <Announcements />
        <AboutUs />
      </div>
    </div>
  );
}