"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

export function SaveUserToLocalStorage() {
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log("Session status:", status);
    console.log("Session data:", session);

    if (status == "authenticated" && session?.user) {
      console.log("Saving user to local storage:", session);
      localStorage.setItem("user", JSON.stringify(session.user));
    }
  }, [status, session]);

  return null;
}
