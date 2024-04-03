import AnnouncementListComponent from "@/components/home/announcement";
import { Announcement, fetchAll } from "../lib/models/announcement";

export default async function Home() {
  var allAnnouncements = await fetchAll();

  // sort announcements by date
  allAnnouncements.sort((a, b) => {
    return b.date_created.getTime() - a.date_created.getTime();
  });

  return (
    <div className="bg-white min-h-full grow text-black bg-stripe flex items-center justify-center">
      <div className="container p-5 bg-white z-10 text-lg my-8">
        <div className="flex flex-row text-purple text-6xl font-bold">
          <h1 className="grow">All Past Announcements</h1>
        </div>
        <ol className="flex flex-col mt-4">
          {allAnnouncements.map((announcement_model, index) => (
            <li key={announcement_model.id}>
              <AnnouncementListComponent announcement={announcement_model} />

              {index !== allAnnouncements.length - 1 && (
                <div className="mx-4 border-solid border-b-2 pb-2 border-purple" />
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
