import mongoose, { Schema, Document } from "mongoose";

export interface ISavedJob extends Document {
  userId: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const SavedJobSchema = new Schema<ISavedJob>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
  },
  { timestamps: true }
);

// Ensure a user can only save a specific job once
SavedJobSchema.index({ userId: 1, jobId: 1 }, { unique: true });

export default mongoose.models.SavedJob || mongoose.model<ISavedJob>("SavedJob", SavedJobSchema);
