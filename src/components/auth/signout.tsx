import { signOut } from "@/auth";
import { ArrowUpRight } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export function SignOut({
  ...props
}: React.HTMLAttributes<HTMLButtonElement>) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={"ghost"}>
          Log Out
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Do you want to log out?</AlertDialogTitle>
          <AlertDialogDescription>
            This will log you out entirely from KSU, and you will need to log in again to continue accessing the wiki.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Stay logged in</AlertDialogCancel>
          <AlertDialogAction>Log Out</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    // <form
    //   action={async () => {
    //     "use server";
    //     await signOut();
    //   }}
    // >
    //   <button
    //     className="align-middle h-8 min-w-max text-bold hover:underline"
    //     {...props}
    //   >
    //     Log Out
    //     <span className="inline-block pl-1 align-middle text-bold">
    //       <ArrowUpRight />
    //     </span>
    //   </button>
    // </form>
  );
}
