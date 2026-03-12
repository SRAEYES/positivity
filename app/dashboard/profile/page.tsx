"use client";

import { useEffect, useState } from "react";
import DashboardNav from "@/components/dashboard-nav";

export default function ProfilePage() {

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">

      <DashboardNav />

      <div className="max-w-xl mx-auto mt-10 bg-white dark:bg-gray-800 p-8 rounded shadow">

        <h1 className="text-2xl font-bold mb-6">My Profile</h1>

        <p><b>Name:</b> {user.name}</p>
        <p><b>Email:</b> {user.email}</p>
        <p><b>Role:</b> {user.role}</p>

      </div>

    </div>
  );
}