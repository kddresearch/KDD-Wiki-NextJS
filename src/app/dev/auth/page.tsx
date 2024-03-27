import { auth } from "@/auth";

export default async function Index() {
  const session = await auth();

  return (
    <div>
      <div>Current Session</div>
      <div>{JSON.stringify(session, null, 2)}</div>
    </div>
  )
}