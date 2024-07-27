import { signOut } from "@/auth";
import { ArrowUpRight } from "react-bootstrap-icons";

export function SignOut({
  ...props
}: React.HTMLAttributes<HTMLButtonElement>) {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <button
        className="align-middle h-8 min-w-max text-bold hover:underline"
        {...props}
      >
        Log Out
        <span className="inline-block pl-1 align-middle text-bold">
          <ArrowUpRight />
        </span>
      </button>
    </form>
  );
}
