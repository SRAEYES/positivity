"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardNav from "@/components/dashboard-nav";

export default function Dashboard() {
  const router = useRouter();

  const [checked, setChecked] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        router.replace("/login");
        setChecked(true);
        setLoggedIn(false);
      } else {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setChecked(true);
        setLoggedIn(true);
      }
    }
  }, [router]);

  if (!checked) {
    return null;
  }

  if (!loggedIn) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
      
      {/* Navigation */}
      <DashboardNav />

      {/* Dashboard Content */}
      <div className="flex flex-1 justify-center items-start py-12 px-4">
        
        <div className="max-w-4xl w-full">

          {/* Welcome */}
          <h1 className="text-3xl font-bold mb-4 text-zinc-900 dark:text-white">
            Welcome {user?.name || "Student"} 👋
          </h1>

          <p className="text-gray-500 dark:text-gray-300 mb-8">
            Manage your learning journey from your dashboard.
          </p>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Explore Courses */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-xl transition">
              
              <h2 className="text-lg font-semibold mb-2 text-zinc-900 dark:text-white">
                Explore Courses
              </h2>

              <p className="text-sm text-gray-500 dark:text-gray-300 mb-4">
                Browse all available courses and enroll in new ones.
              </p>

              <button
                onClick={() => router.push("/courses")}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                View Courses
              </button>

            </div>

            {/* My Courses */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-xl transition">
              
              <h2 className="text-lg font-semibold mb-2 text-zinc-900 dark:text-white">
                My Courses
              </h2>

              <p className="text-sm text-gray-500 dark:text-gray-300 mb-4">
                Check the courses you have enrolled in.
              </p>

              <button
                onClick={() => router.push("/dashboard/enrolled")}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                View My Courses
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}