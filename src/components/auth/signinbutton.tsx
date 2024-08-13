"use client"

import { useState } from "react";
import { Button } from "../ui/button"
import { Loader2 } from "lucide-react";

export function SignInButton() {

  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
  };

  return (
    <Button
      type="submit"
      variant={"ghost"}
      data-disabled={isClicked}
      onClick={handleClick}
    >
      {isClicked && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isClicked ? "Redirecting" : "Log In"}
    </Button>
  )
}
