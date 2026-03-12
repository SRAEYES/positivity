"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {

  const router = useRouter();

  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    revenue: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      setStats(data);
    }

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-10">

      <h1 className="text-3xl font-bold mb-10">
        Admin Dashboard
      </h1>

      {/* Stats Cards */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
          <h2 className="text-lg font-semibold">Students</h2>
          <p className="text-3xl mt-2">{stats.totalStudents}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
          <h2 className="text-lg font-semibold">Courses</h2>
          <p className="text-3xl mt-2">{stats.totalCourses}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
          <h2 className="text-lg font-semibold">Enrollments</h2>
          <p className="text-3xl mt-2">{stats.totalEnrollments}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
          <h2 className="text-lg font-semibold">Revenue</h2>
          <p className="text-3xl mt-2">₹{stats.revenue}</p>
        </div>

      </div>

      {/* Actions */}

      <div className="flex gap-6">

        <button
          onClick={() => router.push("/admin/courses/create")}
          className="bg-blue-600 text-white px-6 py-3 rounded"
        >
          Add Course
        </button>

        <button
          onClick={() => router.push("/admin/courses")}
          className="bg-green-600 text-white px-6 py-3 rounded"
        >
          Modify Courses
        </button>

      </div>

    </div>
  );
}