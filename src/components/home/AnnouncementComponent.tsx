import Announcement from "@/models/announcement";
import { fetchCurrent } from "@/db/announcement";
import Link from "next/link";
import AnnouncementListComponent from "./announcement";
import { BoxArrowUpRight } from "react-bootstrap-icons";
import Card from "../layout/card";

interface AnnouncementComponentProps {
  listofAnnouncements: Announcement[];
}

const AnnouncementComponent = ({ listofAnnouncements }: AnnouncementComponentProps) => {

  if (listofAnnouncements.length === 0) {
    return null;
  } 

  return (
    <Card className="-mt-8" title="Announcements" link="/announcement">
      <ol className="flex flex-col">
        {listofAnnouncements.map((announcement_model, index) => (
          <li key={announcement_model.id}>
            <AnnouncementListComponent announcement={announcement_model} />

            {index !== listofAnnouncements.length - 1 && (
              <div className="mx-4 border-solid border-b-2 pb-2 border-gray" />
            )}
          </li>
        ))}
      </ol>
    </Card>
  );
};

export default AnnouncementComponent;
