"use client";

import Link from "next/link";

export default function DashboardNav() {
  return (
    <nav className="w-full bg-white dark:bg-gray-900 shadow p-4 flex gap-6 justify-center">

      <Link href="/dashboard" className="hover:text-blue-600">
        Dashboard
      </Link>

      <Link href="/courses" className="hover:text-blue-600">
        Courses
      </Link>

      <Link href="/dashboard/enrolled" className="hover:text-blue-600">
        My Courses
      </Link>

      <Link href="/dashboard/profile" className="hover:text-blue-600">
        Profile
      </Link>

      <Link href="/logout" className="text-red-500">
        Logout
      </Link>

    </nav>
  );
}