"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "./Loader";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        if (allowedRoles && !allowedRoles.includes(data.user.role)) {
          router.push("/unauthorized");
          return;
        }
        setAuthorized(true);
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router, allowedRoles]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
        <Loader />
      </div>
    );
  }

  return authorized ? <>{children}</> : null;
}
