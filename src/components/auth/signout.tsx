import { signOut } from "@/auth";

export function SignOut({ provider="google", ...props }: {provider?: string} & React.HTMLAttributes<HTMLButtonElement>) {
  return (
    <form action={async () => {
      "use server"
      await signOut()
    }}>
      <button className="h-8 px-4 border-purple border-solid border-2 rounded-full min-w-max" {...props}>Sign Out</button>
    </form>
  );
}