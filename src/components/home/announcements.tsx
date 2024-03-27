import Link from "next/link";

const Announcements = () => {
  return (
    <div className="container p-5 bg-white -mt-8 mb-8 z-10">
      <h1 className="text-purple text-6xl font-bold">Announcements</h1>

      <div className="pt-2 flex flex-row">
        <div className="pr-4 my-auto">6/21/2023</div>
        <Link href={"/"} className="grow">
          <div className="font-bold text-2xl truncate">Grammarly for Wiki Content</div>
        </Link>
      </div>

      <div className="mx-4 border-solid border-b-2 pb-2 border-purple" />

      <div className="pt-2 flex flex-row">
        <div className="pr-4 my-auto">6/19/2023</div>
        <div className="font-bold text-2xl grow">
          Top-level research page now online
        </div>
      </div>

      <div className="mx-4 border-solid border-b-2 pb-2 border-purple" />

      <div className="pt-2 flex flex-row">
        <div className="pr-4 my-auto">6/21/2023</div>
        <div className="font-bold text-2xl grow">Grammarly for Wiki Content</div>
      </div>

      <div className="mx-4 border-solid border-b-2 pb-2 border-purple" />

      <div className="pt-2 flex flex-row">
        <div className="pr-4 my-auto">6/19/2023</div>
        <div className="font-bold text-2xl grow">
          Top-level research page now online
        </div>
      </div>
    </div>
  );
};

export default Announcements;