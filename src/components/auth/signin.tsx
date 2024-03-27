// import { SignInButton } from "./signinbutton";
// import react button 

import { signIn } from "@/auth";

export function SignIn({ provider="google", ...props }: {provider?: string} & React.HTMLAttributes<HTMLButtonElement>) {
  return (
    <form action={async () => {
      "use server"
      await signIn(provider)
    }}>
      <button className="h-8 px-4 border-purple border-solid border-2 rounded-full min-w-max" {...props}>Sign In</button>
    </form>
  );
}