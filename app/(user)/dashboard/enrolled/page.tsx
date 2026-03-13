"use client";

import { useEffect, useState } from "react";

export default function EnrolledCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchEnrollments() {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.id) {
      const res = await fetch(`/api/enrollments?userId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setCourses(data.enrollments || []);
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchEnrollments();
  }, []);

  async function handleUnenroll(courseId: number) {
    if (!confirm("Are you sure you want to drop this course?")) return;

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    try {
      const res = await fetch("/api/enroll", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, courseId })
      });
      if (res.ok) {
        fetchEnrollments();
      } else {
        alert("Failed to de-enroll.");
      }
    } catch {
      alert("Error processing your request.");
    }
  }

  return (
    <div className="py-10 px-4 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center text-zinc-900 dark:text-zinc-100">My Courses</h1>

      {loading ? (
        <div className="text-center text-zinc-500">Loading...</div>
      ) : courses.length === 0 ? (
        <div className="text-center text-zinc-500 dark:text-zinc-400 mt-10">
          You are not enrolled in any courses yet.
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {courses.map((e: any) => (
            <div key={e.id} className="bg-white dark:bg-gray-800 rounded-lg shadow border dark:border-gray-700 overflow-hidden flex flex-col">
              {e.course.thumbnail && (
                <img src={e.course.thumbnail} alt={e.course.title} className="w-full h-32 object-cover" />
              )}
              <div className="p-5 flex-1 flex flex-col">
                <h2 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-white">{e.course.title}</h2>
                <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-4 flex-1">
                  Started: {new Date(e.createdAt).toLocaleDateString()}
                </div>

                <div className="mt-auto">
                  {e.paid ? (
                    <div className="flex gap-4 mb-4">
                      {e.course.wpLink && <a href={e.course.wpLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm font-medium">WhatsApp Group</a>}
                      {e.course.gcrLink && <a href={e.course.gcrLink} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline text-sm font-medium">Classroom</a>}
                    </div>
                  ) : (
                    <p className="text-orange-500 text-sm font-medium mb-4">Payment Pending</p>
                  )}

                  <button 
                    onClick={() => handleUnenroll(e.courseId)}
                    className="w-full bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-900 hover:bg-red-100 dark:hover:bg-red-900/40 py-2 rounded transition font-medium text-sm"
                  >
                    De-enroll
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}