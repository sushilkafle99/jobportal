import mongoose, { Schema, Document } from "mongoose";

export interface IRecruiter extends Document {
  userId: mongoose.Types.ObjectId;
  companyId?: mongoose.Types.ObjectId;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RecruiterSchema = new Schema<IRecruiter>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    companyId: { type: Schema.Types.ObjectId, ref: "Company" },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Recruiter || mongoose.model<IRecruiter>("Recruiter", RecruiterSchema);
