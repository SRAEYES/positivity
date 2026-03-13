"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function CreateCoursePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    thumbnail: "",
    timeslot: "",
    startDate: "",
    wpLink: "",
    gcrLink: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/course/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push("/admin/courses");
      } else {
        const data = await res.json();
        setError(data.error || "Failed to create course");
      }
    } catch (err) {
      setError("Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Add New Course</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <Label htmlFor="title">Course Title</Label>
          <Input id="title" name="title" value={form.title} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="thumbnail">Thumbnail URL</Label>
          <Input id="thumbnail" name="thumbnail" value={form.thumbnail} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="timeslot">Timeslot</Label>
          <Input id="timeslot" name="timeslot" value={form.timeslot} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="startDate">Start Date</Label>
          <Input id="startDate" name="startDate" type="date" value={form.startDate} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="wpLink">WP Link</Label>
          <Input id="wpLink" name="wpLink" value={form.wpLink} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="gcrLink">GCR Link</Label>
          <Input id="gcrLink" name="gcrLink" value={form.gcrLink} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="description">Course Description</Label>
          <textarea id="description" name="description" value={form.description} onChange={handleChange} required className="w-full border rounded p-2 min-h-[80px]" />
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <Button type="submit" disabled={loading}>{loading ? "Adding..." : "Add Course"}</Button>
      </form>
    </div>
  );
}
