import Breadcrumb from "@/components/breadcrumb";
import AboutUs from "@/components/home/about-us";
import Announcements from "@/components/home/AnnouncementComponent";
import StripeBackDrop from "@/components/layout/backdrop";
import Image from "next/image";
import Link from "next/link";
import { fetchCurrent } from "./lib/models/announcement";
import ImageBackDrop from "@/components/layout/imagebackdrop";

export const metadata = {
  title: "KSU KDD Wiki",
  description: "KDD Research Group at Kansas State University",
};

export default async function Home() {

  const listofAnnouncements = await fetchCurrent();

  return (
    <div className="flex flex-col min-h-screen relative">
      <ImageBackDrop image="/images/placeholder.jpeg" />
      <StripeBackDrop>
        <Announcements listofAnnouncements={listofAnnouncements} />
        <AboutUs />
      </StripeBackDrop>
    </div>
  );
}
