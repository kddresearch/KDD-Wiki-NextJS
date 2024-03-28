import { Announcement, fetchCurrent } from "@/app/lib/models/announcement";
import Link from "next/link";
import AnnouncementListComponent from "./announcement";
import { BoxArrowUpRight } from "react-bootstrap-icons";
import Card from "../page/card";

const AnnouncementComponent = async () => {

  var listofAnnouncements: Announcement[] = []

  var listofAnnouncements = await fetchCurrent();


  return (
    <Card className="-mt-8">
      <div className="">
        <Link href={"/announcement"} className="flex flex-row text-purple text-6xl font-bold">
        <h1 className="grow">Announcements</h1>
          <BoxArrowUpRight className="text-4xl inline-block justify-center my-auto"/>
        </Link>
      </div>
      

      <ol className="flex flex-col">
        {listofAnnouncements.map((announcement_model, index) => (
          <li key={announcement_model.id}>
            <AnnouncementListComponent announcement={announcement_model} />

            {index !== listofAnnouncements.length - 1 && (
            <div className="mx-4 border-solid border-b-2 pb-2 border-purple" />
            )}
          </li>
        ))}
      </ol>
    </Card>
  );
};

export default AnnouncementComponent;