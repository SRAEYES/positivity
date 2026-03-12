"use client";

import { useEffect, useState } from "react";

export default function EnrolledCourses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    async function fetchEnrollments() {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const res = await fetch(`/api/enrollments?userId=${user.id}`);
      const data = await res.json();

      setCourses(data.enrollments || []);
    }

    fetchEnrollments();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">My Courses</h1>

      {courses.map((e: any) => (
        <div key={e.id} className="border p-4 mb-4 rounded">
          <h2 className="text-xl font-semibold">{e.course.title}</h2>

          {e.paid ? (
            <div className="mt-2 flex gap-4">
              <a href={e.course.wpLink}>WhatsApp</a>
              <a href={e.course.gcrLink}>Classroom</a>
            </div>
          ) : (
            <p className="text-red-500">Payment Pending</p>
          )}
        </div>
      ))}
    </div>
  );
}