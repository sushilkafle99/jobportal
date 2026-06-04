import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/utils/auth";

export async function GET(request: NextRequest) {
  try {
    const tokenCookie = request.cookies.get("token");
    const token = tokenCookie ? tokenCookie.value : null;

    if (!token) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ message: "Invalid session" }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (!user.isActive) {
      return NextResponse.json({ message: "Account suspended" }, { status: 403 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Auth Me error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
