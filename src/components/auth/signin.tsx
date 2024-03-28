import { signIn } from "@/auth";
import { ArrowUpRight } from "react-bootstrap-icons";

export function SignIn({ provider="google", ...props }: {provider?: string} & React.HTMLAttributes<HTMLButtonElement>) {
  return (
    <form action={async () => {
      "use server"
      await signIn(provider)
    }}>
      <button className="align-middle h-8 min-w-max text-bold hover:underline" {...props}>
        Log In
        <span className="inline-block pl-1 align-middle text-bold"><ArrowUpRight/></span>
      </button>
    </form>
  );
}