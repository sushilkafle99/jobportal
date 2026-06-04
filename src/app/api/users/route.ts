import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/utils/auth";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = await verifyToken(token);
    if (!decoded || decoded.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await dbConnect();
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");

    const query: { role?: string } = {};
    if (role) query.role = role;

    const users = await User.find(query).select("-password").sort({ createdAt: -1 });
    return NextResponse.json({ users });
  } catch (error) {
    console.error("GET Users Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
