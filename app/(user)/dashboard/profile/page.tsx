"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    async function fetchUserProfile() {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsedUser = JSON.parse(stored);
        
        try {
          const res = await fetch(`/api/user/${parsedUser.id}`);
          if (res.ok) {
            const fullProfile = await res.json();
            setUser(fullProfile);
            setFormData(fullProfile);
          } else {
            setUser(parsedUser);
            setFormData(parsedUser);
          }
        } catch (error) {
           setUser(parsedUser);
           setFormData(parsedUser);
        }
      }
      setLoading(false);
    }

    fetchUserProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/user/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setIsEditing(false);
        // Update local storage name if it changed
        const stored = JSON.parse(localStorage.getItem("user") || "{}");
        stored.name = data.user.name;
        localStorage.setItem("user", JSON.stringify(stored));
      } else {
        alert("Failed to update profile");
      }
    } catch {
      alert("Error saving profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-zinc-500">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8 text-center text-red-500">
        Please log in to view your profile.
      </div>
    );
  }

  return (
    <div className="py-10 px-4">

      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded shadow">

        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            My Profile
          </h1>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              Edit Profile
            </Button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-zinc-700 dark:text-zinc-300">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" value={formData.name || ""} onChange={handleChange} className="mb-4 mt-1" required />

              <Label htmlFor="email">Email Address (Read Only)</Label>
              <Input id="email" value={formData.email || ""} disabled className="mb-4 mt-1 bg-gray-100 dark:bg-gray-700" />

              <Label htmlFor="age">Age</Label>
              <Input id="age" name="age" type="number" value={formData.age || ""} onChange={handleChange} className="mb-4 mt-1" />
            </div>

            <div>
              <Label htmlFor="country">Country</Label>
              <Input id="country" name="country" value={formData.country || ""} onChange={handleChange} className="mb-4 mt-1" />

              <Label htmlFor="state">State</Label>
              <Input id="state" name="state" value={formData.state || ""} onChange={handleChange} className="mb-4 mt-1" />

              <Label htmlFor="location">Location / Address</Label>
              <Input id="location" name="location" value={formData.location || ""} onChange={handleChange} className="mb-4 mt-1" />

              <Label htmlFor="parentName">Parent/Guardian Name</Label>
              <Input id="parentName" name="parentName" value={formData.parentName || ""} onChange={handleChange} className="mb-4 mt-1" />

              <Label htmlFor="parentRel">Parent Relationship</Label>
              <Input id="parentRel" name="parentRel" value={formData.parentRel || ""} onChange={handleChange} className="mb-4 mt-1" />
            </div>

            <div className="col-span-1 md:col-span-2 flex gap-4 mt-4">
              <Button type="button" variant="outline" onClick={() => { setIsEditing(false); setFormData(user); }}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-zinc-700 dark:text-zinc-300">
            <div>
              <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-1">Full Name</p>
              <p className="text-lg pb-4">{user.name || "N/A"}</p>

              <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-1">Email Address</p>
              <p className="text-lg pb-4">{user.email || "N/A"}</p>

              <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-1">Role</p>
              <p className="text-lg pb-4 capitalize">{user.role || "student"}</p>

              <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-1">Age</p>
              <p className="text-lg pb-4">{user.age || "N/A"}</p>
            </div>

            <div>
               <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-1">Country</p>
              <p className="text-lg pb-4">{user.country || "N/A"}</p>

              <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-1">State</p>
              <p className="text-lg pb-4">{user.state || "N/A"}</p>

              <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-1">Location / Address</p>
              <p className="text-lg pb-4">{user.location || "N/A"}</p>

              {user.parentName && (
                 <>
                   <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-1">Parent/Guardian Name</p>
                   <p className="text-lg pb-4">{user.parentName} {user.parentRel ? `(${user.parentRel})` : ""}</p>
                 </>
              )}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}