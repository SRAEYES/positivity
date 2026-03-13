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
  const [enrollments, setEnrollments] = useState<any[]>([]);

  useEffect(() => {
    async function fetchStats() {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      setStats(data);
    }
    async function fetchEnrollments() {
      const res = await fetch("/api/admin/enrollments");
      const data = await res.json();
      setEnrollments(data.enrollments || []);
    }
    fetchStats();
    fetchEnrollments();
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

      <div className="flex gap-6 mb-10">
        <button
          onClick={() => router.push("/admin/courses/create")}
          className="bg-blue-600 text-white px-6 py-3 rounded shadow-lg hover:bg-blue-700 transition"
        >
          Add Course
        </button>
        <button
          onClick={() => router.push("/admin/courses")}
          className="bg-green-600 text-white px-6 py-3 rounded shadow-lg hover:bg-green-700 transition"
        >
          Modify Courses
        </button>
        <button
          className="bg-purple-600 text-white px-6 py-3 rounded shadow-lg hover:bg-purple-700 transition"
        >
          Send Notification
        </button>
      </div>

      {/* Enrollments Table */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow mb-10">
        <h2 className="text-xl font-bold mb-4 text-indigo-700 dark:text-indigo-300">Student Enrollments</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-indigo-100 dark:bg-indigo-900">
                <th className="px-4 py-2 text-left">Student</th>
                <th className="px-4 py-2 text-left">Course</th>
                <th className="px-4 py-2 text-left">Enrolled At</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((enroll) => (
                <tr key={enroll.id} className="border-b">
                  <td className="px-4 py-2">{enroll.user?.name || enroll.user?.email}</td>
                  <td className="px-4 py-2">{enroll.course?.title}</td>
                  <td className="px-4 py-2">{enroll.createdAt ? new Date(enroll.createdAt).toLocaleString() : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}