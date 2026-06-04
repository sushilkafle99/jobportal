import mongoose, { Schema, Document } from "mongoose";

export interface IApplication extends Document {
  jobId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  resumeUrl: string;
  coverLetter?: string;
  status: "Pending" | "Reviewing" | "Shortlisted" | "Rejected" | "Accepted";
  appliedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    resumeUrl: { type: String, required: true },
    coverLetter: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Pending", "Reviewing", "Shortlisted", "Rejected", "Accepted"],
      default: "Pending",
    },
    appliedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Application || mongoose.model<IApplication>("Application", ApplicationSchema);
