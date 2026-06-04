import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    role: z.enum(["USER", "RECRUITER"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const jobSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  requirements: z.string().min(3, "Requirements are required. Provide comma-separated values."),
  responsibilities: z.string().min(3, "Responsibilities are required. Provide comma-separated values."),
  salaryMin: z.coerce.number().min(0, "Minimum salary must be positive"),
  salaryMax: z.coerce.number().min(0, "Maximum salary must be positive"),
  experienceLevel: z.enum(["Entry", "Mid", "Senior", "Lead"]),
  employmentType: z.enum(["Full-Time", "Part-Time", "Contract", "Internship", "Remote"]),
  location: z.string().min(2, "Location is required"),
  category: z.string().min(2, "Category is required"),
  skills: z.string().min(2, "Skills are required. Provide comma-separated values."),
  status: z.enum(["Active", "Draft", "Closed"]).default("Active"),
  companyId: z.string().min(1, "Company is required"),
});

export const companySchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters"),
  logo: z.string().url("Invalid logo URL").or(z.literal("")).optional(),
  website: z.string().url("Invalid website URL").or(z.literal("")).optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  industry: z.string().min(2, "Industry is required"),
  location: z.string().min(2, "Location is required"),
  employeeCount: z.coerce.number().min(0, "Employee count must be positive"),
  foundedYear: z.coerce.number().min(1800, "Founded year must be valid").max(new Date().getFullYear()),
});

export const applicationSchema = z.object({
  resumeUrl: z.string().url("Invalid resume URL. Please provide a valid file link."),
  coverLetter: z.string().max(1000, "Cover letter must be under 1000 characters").optional(),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional().or(z.literal("")),
  location: z.string().optional().or(z.literal("")),
  profileImage: z.string().url("Invalid URL").or(z.literal("")).optional(),
  resumeUrl: z.string().url("Invalid URL").or(z.literal("")).optional(),
});
