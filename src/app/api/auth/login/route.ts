import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { loginSchema } from "@/validations/schemas";
import { comparePassword, signToken } from "@/utils/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: "Validation error", errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    await dbConnect();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    if (!user.isActive) {
      return NextResponse.json(
        { message: "Your account has been suspended. Please contact support." },
        { status: 403 }
      );
    }

    const token = await signToken({
      userId: user._id.toString(),
      role: user.role,
      email: user.email,
    });

    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
      },
    });

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 2, // 2 hours
    });

    return response;
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ message: "An internal server error occurred" }, { status: 500 });
  }
}
