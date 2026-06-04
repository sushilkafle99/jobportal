"use client";

import React, { useState, useEffect } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import Input from "@/components/Input";
import Button from "@/components/Button";

export default function SeekerProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");

  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUserId(data.user._id);
          setName(data.user.name || "");
          setEmail(data.user.email || "");
          setPhone(data.user.phone || "");
          setLocation(data.user.location || "");
          setProfileImage(data.user.profileImage || "");
          setResumeUrl(data.user.resumeUrl || "");
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    }
    fetchProfile();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      setError("Name is required");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setSuccess("");

      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, location, profileImage, resumeUrl }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to update profile");
        return;
      }

      setSuccess("Profile updated successfully!");
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl">
      <DashboardHeader
        title="My Profile"
        description="Update your candidate profile information and resume document link."
      />

      <form onSubmit={handleUpdate} className="p-6 md:p-8 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl shadow-sm flex flex-col gap-5">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs font-semibold text-rose-600 dark:bg-rose-955/20 dark:border-rose-900/50">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs font-semibold text-emerald-600 dark:bg-emerald-955/20 dark:border-emerald-900/50">
            {success}
          </div>
        )}

        <Input
          label="Full Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-500">Email Address (Cannot change)</label>
          <input
            type="email"
            value={email}
            disabled
            className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 cursor-not-allowed text-sm font-semibold"
          />
        </div>

        <Input
          label="Phone Number"
          type="tel"
          placeholder="+1 (555) 000-0000"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <Input
          label="Location (City, Country)"
          type="text"
          placeholder="San Francisco, CA"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <Input
          label="Profile Image URL Link"
          type="url"
          placeholder="https://example.com/avatar.jpg"
          value={profileImage}
          onChange={(e) => setProfileImage(e.target.value)}
        />

        <Input
          label="Resume Document URL Link"
          type="url"
          placeholder="https://drive.google.com/file/d/... or dropbox link"
          value={resumeUrl}
          onChange={(e) => setResumeUrl(e.target.value)}
        />

        <Button type="submit" isLoading={isLoading} className="mt-4 self-start">
          Save Profile Updates
        </Button>
      </form>
    </div>
  );
}
