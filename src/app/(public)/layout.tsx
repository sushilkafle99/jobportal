import React from "react";
import { cookies } from "next/headers";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/utils/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  let user = null;

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (token) {
      const decoded = await verifyToken(token);
      if (decoded) {
        await dbConnect();
        const dbUser = await User.findById(decoded.userId).select("name email role profileImage");
        if (dbUser) {
          user = {
            name: dbUser.name,
            email: dbUser.email,
            role: dbUser.role,
            profileImage: dbUser.profileImage,
          };
        }
      }
    }
  } catch (error) {
    console.error("Failed to fetch public layout auth", error);
  }

  return (
    <>
      <Navbar user={user} />
      <main className="flex-1 flex flex-col bg-zinc-50/30 dark:bg-zinc-950/20">{children}</main>
      <Footer />
    </>
  );
}
