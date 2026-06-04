import mongoose, { Schema, Document } from "mongoose";

export interface IJob extends Document {
  title: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  salaryMin: number;
  salaryMax: number;
  experienceLevel: "Entry" | "Mid" | "Senior" | "Lead";
  employmentType: "Full-Time" | "Part-Time" | "Contract" | "Internship" | "Remote";
  location: string;
  category: string;
  skills: string[];
  status: "Active" | "Draft" | "Closed";
  companyId: mongoose.Types.ObjectId;
  recruiterId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    requirements: [{ type: String }],
    responsibilities: [{ type: String }],
    salaryMin: { type: Number, required: true },
    salaryMax: { type: Number, required: true },
    experienceLevel: {
      type: String,
      enum: ["Entry", "Mid", "Senior", "Lead"],
      required: true,
    },
    employmentType: {
      type: String,
      enum: ["Full-Time", "Part-Time", "Contract", "Internship", "Remote"],
      required: true,
    },
    location: { type: String, required: true },
    category: { type: String, required: true },
    skills: [{ type: String }],
    status: {
      type: String,
      enum: ["Active", "Draft", "Closed"],
      default: "Active",
    },
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    recruiterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Job || mongoose.model<IJob>("Job", JobSchema);
