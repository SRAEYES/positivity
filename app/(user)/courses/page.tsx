"use client";

import { useEffect, useState } from "react";

interface Course {
  id: number;
  title: string;
  thumbnail?: string;
  timeslot?: string;
  wpLink?: string;
  gcrLink?: string;
  description?: string;
  startDate?: string;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState<number[]>([]);

  useEffect(() => {
    async function fetchCourses() {
      const res = await fetch("/api/courses");
      if (res.ok) {
        const data = await res.json();
        setCourses(data.courses || []);
      }
      setLoading(false);
    }
    fetchCourses();

    // Fetch enrolled courses for the user
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.id) {
      fetch(`/api/enrollments?userId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          setEnrolledCourses(data.enrollments?.map((e: any) => e.courseId) || []);
        });
    }
  }, []);

  return (
    <div className="py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-zinc-900 dark:text-zinc-100">Courses</h1>
      {loading ? (
        <div className="text-center text-zinc-500 dark:text-zinc-300">Loading...</div>
      ) : (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 max-w-6xl mx-auto">
          {courses.length === 0 ? (
            <div className="col-span-full text-center text-zinc-500 dark:text-zinc-300">No courses found.</div>
          ) : (
            courses.map((course) => (
              <div key={course.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col">
                {course.thumbnail && (
                  <img src={course.thumbnail} alt={course.title} className="w-full h-40 object-cover" />
                )}
                <div className="p-6 flex-1 flex flex-col">
                  <h2 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-zinc-100">{course.title}</h2>
                  {course.description && (
                     <p className="text-zinc-600 dark:text-zinc-300 mb-4 line-clamp-3">{course.description}</p>
                   )}
                  {course.startDate && (
                    <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">Start: {new Date(course.startDate).toLocaleDateString()}</div>
                  )}
                  {course.timeslot && (
                    <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">Timeslot: {course.timeslot}</div>
                  )}
                  <div className="mt-auto flex gap-2 flex-wrap">
                    {enrolledCourses.includes(course.id) ? (
                      <button 
                         onClick={async () => {
                           if (!confirm("Are you sure you want to drop this course?")) return;
                           const user = JSON.parse(localStorage.getItem("user") || "{}");
                           const res = await fetch("/api/enroll", {
                             method: "DELETE",
                             headers: { "Content-Type": "application/json" },
                             body: JSON.stringify({ userId: user.id, courseId: course.id }),
                           });
                           if (res.ok) {
                             setEnrolledCourses(enrolledCourses.filter(id => id !== course.id));
                           } else {
                             alert("De-enrollment failed");
                           }
                         }}
                         className="bg-red-50 text-red-600 border border-red-200 px-3 py-1 rounded text-sm font-medium hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900 dark:hover:bg-red-900/40"
                       >
                         De-enroll
                       </button>
                    ) : (
                       <button
                         onClick={async () => {
                           const user = JSON.parse(localStorage.getItem("user") || "{}");
                           const res = await fetch("/api/enroll", {
                             method: "POST",
                             headers: {
                               "Content-Type": "application/json",
                             },
                             body: JSON.stringify({
                               userId: user.id,
                               courseId: course.id,
                             }),
                           });
                           if (res.ok) {
                             alert("Enrolled successfully!");
                             setEnrolledCourses([...enrolledCourses, course.id]);
                           } else {
                             alert("Enrollment failed");
                           }
                         }}
                         className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                       >
                         Enroll
                       </button>
                    )}
                    {enrolledCourses.includes(course.id) && course.wpLink && (
                      <a href={course.wpLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">WhatsApp</a>
                    )}
                    {enrolledCourses.includes(course.id) && course.gcrLink && (
                      <a href={course.gcrLink} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline text-sm">Google Classroom</a>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
