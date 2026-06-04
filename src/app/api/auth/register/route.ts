import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import Recruiter from "@/models/Recruiter";
import { registerSchema } from "@/validations/schemas";
import { hashPassword } from "@/utils/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: "Validation error", errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, password, role } = result.data;

    await dbConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "Email is already registered" }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    if (role === "RECRUITER") {
      await Recruiter.create({
        userId: newUser._id,
        verified: false,
      });
    }

    return NextResponse.json(
      { message: "Registration successful. You can now log in.", userId: newUser._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json({ message: "An internal server error occurred" }, { status: 500 });
  }
}
