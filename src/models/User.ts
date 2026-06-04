import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: "ADMIN" | "RECRUITER" | "USER";
  profileImage?: string;
  phone?: string;
  location?: string;
  resumeUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["ADMIN", "RECRUITER", "USER"], default: "USER" },
    profileImage: { type: String, default: "" },
    phone: { type: String, default: "" },
    location: { type: String, default: "" },
    resumeUrl: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
