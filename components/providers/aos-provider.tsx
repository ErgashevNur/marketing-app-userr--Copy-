"use client";

import type React from "react";
import { useEffect } from "react";

export default function AOS({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Dynamic import with proper access to the default export
    import("aos").then((aosModule) => {
      const aos = aosModule.default;
      aos.init({
        once: true,
        duration: 700,
        easing: "ease-out-cubic",
      });
    });
  }, []);

  return <>{children}</>;
}
