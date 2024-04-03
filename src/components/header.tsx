import KddUser from "@/app/lib/models/kdd_user";
import UnitBar from "./unit-bar/unit-bar";
import Navigation from "./unit-bar/nav-menu";
import Link from "next/link";
import { auth } from "@/auth";

export default async function Header() {
  const session = await auth();

  let user;

  if (session?.user) {
    user = new KddUser(session?.user);
  } else {
    user = KddUser.guestFactory();
  }

  return (
    <header className="bg-white">
      <div className="w-full h-8 px-4 bg-gray text-purple">
        <div className="flex flex-row justify-between h-full container">
          <Link className="my-auto" href={"https://k-state.edu"}>
            <h1 className="text-xs h-4">Kansas State University</h1>
          </Link>
          <div className="grow"></div>
          {session ? (
            <>
              <Link className="my-auto" href={`/member/${user.username}`}>
                <h1 className="text-xs h-4">
                  Welcome <span className="font-semibold">{user.username}</span>
                </h1>
              </Link>
            </>
          ) : (
            <Link className="my-auto" href={"/"}>
              <h1 className="text-xs h-4">KDD Research Lab</h1>
            </Link>
          )}
        </div>
      </div>
      <UnitBar
        title="Laboratory for Knowledge Discovery in Databases (KSU KDD Lab)"
        kdduser={KddUser.guestFactory().toJSON()}
      />
      <Navigation />
    </header>
  );
}
