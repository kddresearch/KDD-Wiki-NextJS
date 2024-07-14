import { Announcement } from "@/models/announcement";
import Link from "next/link";

const AnnouncementListComponent = ({
  announcement,
}: {
  announcement: Announcement;
}) => {
  return (
    <div className="pt-2 flex flex-row">
      <div className="pr-4 my-auto">
        {announcement.date_created.toLocaleDateString()}
      </div>
      <Link
        href={`/announcement/${announcement.id}`}
        className="grow hover:underline"
      >
        <div className="font-bold text-2xl truncate">{announcement.title}</div>
      </Link>
    </div>
  );
};

export default AnnouncementListComponent;
