import { handleSignIn } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { SignInButton } from "./signinbutton";

export function SignIn() {
  return (
    <form action={handleSignIn}>
      <SignInButton/>
    </form>
  );
}
