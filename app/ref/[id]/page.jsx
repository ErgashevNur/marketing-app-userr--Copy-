"use client";

import { useEffect, use } from "react";
import { useRouter } from "next/navigation";

export default function RefPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params); // params ni unwrap qilish
  const { id } = resolvedParams;

  useEffect(() => {
    if (id) {
      localStorage.setItem("mlm-referal", id);
      router.push("/");
    }
  }, [id, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <p className="text-lg font-medium text-gray-700">Redirecting...</p>
    </div>
  );
}
