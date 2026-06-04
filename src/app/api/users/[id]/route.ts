import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/utils/auth";
import { updateProfileSchema } from "@/validations/schemas";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = await verifyToken(token);
    if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const isSelf = decoded.userId === id;
    const isAdmin = decoded.role === "ADMIN";

    if (!isSelf && !isAdmin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    await dbConnect();

    if (isAdmin && body.isActive !== undefined) {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { isActive: body.isActive },
        { new: true }
      ).select("-password");
      return NextResponse.json({ message: "User status updated successfully", user: updatedUser });
    }

    const result = updateProfileSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { message: "Validation error", errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, phone, location, profileImage, resumeUrl } = result.data;

    const updateFields: {
      name: string;
      phone?: string;
      location?: string;
      profileImage?: string;
      resumeUrl?: string;
    } = { name };
    if (phone !== undefined) updateFields.phone = phone;
    if (location !== undefined) updateFields.location = location;
    if (profileImage !== undefined) updateFields.profileImage = profileImage;
    if (resumeUrl !== undefined) updateFields.resumeUrl = resumeUrl;

    const updatedUser = await User.findByIdAndUpdate(id, updateFields, { new: true }).select("-password");

    return NextResponse.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("PATCH User Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
