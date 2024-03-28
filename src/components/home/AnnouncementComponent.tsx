import { Announcement, fetchCurrent } from "@/app/lib/models/announcement";
import Link from "next/link";
import AnnouncementListComponent from "./announcement";

const AnnouncementComponent = async () => {

  var listofAnnouncements: Announcement[] = []

  var listofAnnouncements = await fetchCurrent();


  return (
    <div className="container p-5 bg-white -mt-8 mb-8 z-10">
      <h1 className="text-purple text-6xl font-bold">Announcements</h1>

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
    </div>
  );
};

export default AnnouncementComponent;