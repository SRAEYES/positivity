"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Logout() {
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
    }
    router.replace("/login");
  }, [router]);
  return null;
}
