"use client";

import { useEffect, useState } from "react";

export default function AdminCourses() {

  const [courses, setCourses] = useState([]);

  async function fetchCourses() {
    const res = await fetch("/api/courses");
    const data = await res.json();
    setCourses(data.courses || []);
  }

  useEffect(() => {
    fetchCourses();
  }, []);

  async function deleteCourse(id: number) {

    if (!confirm("Delete this course?")) return;

    const res = await fetch(`/api/admin/course/delete?id=${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      fetchCourses();
    }
  }

  return (
    <div className="p-10">

      <h1 className="text-3xl font-bold mb-8">
        Manage Courses
      </h1>

      <div className="space-y-4">

        {courses.map((course: any) => (

          <div
            key={course.id}
            className="flex justify-between items-center border p-4 rounded"
          >

            <div>
              <h2 className="font-semibold">{course.title}</h2>
            </div>

            <div className="flex gap-3">

              <button
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => deleteCourse(course.id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}