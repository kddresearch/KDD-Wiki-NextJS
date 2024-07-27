import { signIn, auth } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect";

import { ArrowUpRight } from "react-bootstrap-icons";

const SIGNIN_ERROR_URL = "/NotAuthorized";

export function SignIn({
  provider = "Auth0",
  ...props
}: { provider?: string } & React.HTMLAttributes<HTMLButtonElement>) {
  return (
    <form
      action={async () => {
        "use server";

        try {
          console.log("Signing in with provider", provider);
          await signIn(provider);
        } catch (error) {
          console.error("Error signing in:", error);

          // if (isRedirectError(error)) {
          //   throw error;
          // }
          
          if (error instanceof AuthError) {
            return redirect(`${SIGNIN_ERROR_URL}?message=${error.type}&callback=/`);
          }

          throw error;
        }

        console.log("Signing in with provider", provider);

        await signIn(provider);
      }}
    >
      <button
        className="align-middle h-8 min-w-max text-bold hover:underline"
        {...props}
      >
        Log In
        <span className="inline-block pl-1 align-middle text-bold">
          <ArrowUpRight />
        </span>
      </button>
    </form>
  );
}
