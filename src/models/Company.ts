import mongoose, { Schema, Document } from "mongoose";

export interface ICompany extends Document {
  name: string;
  logo?: string;
  website?: string;
  description?: string;
  industry?: string;
  location?: string;
  employeeCount?: number;
  foundedYear?: number;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema = new Schema<ICompany>(
  {
    name: { type: String, required: true },
    logo: { type: String, default: "" },
    website: { type: String, default: "" },
    description: { type: String, default: "" },
    industry: { type: String, default: "" },
    location: { type: String, default: "" },
    employeeCount: { type: Number, default: 0 },
    foundedYear: { type: Number },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Company || mongoose.model<ICompany>("Company", CompanySchema);
