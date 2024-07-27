import { signIn, auth } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect";
import { handleSignIn } from "@/actions/auth";

import { ArrowUpRight } from "react-bootstrap-icons";
import { Button } from "@/components/ui/button"

const SIGNIN_ERROR_URL = "/NotAuthorized";

export function SignIn() {
  return (
    <form action={handleSignIn}>
      <Button
        type="submit"
        variant={"ghost"}
      >
        Log In
      </Button>
    </form>
  );
}
