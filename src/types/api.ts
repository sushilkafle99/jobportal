/**
 * Generic API response types
 */

export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "RECRUITER" | "USER";
  profileImage?: string;
  phone?: string;
  location?: string;
  resumeUrl?: string;
}

export interface Company {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  description?: string;
  industry?: string;
  location?: string;
  employeeCount?: number;
  foundedYear?: number;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  salaryMin: number;
  salaryMax: number;
  experienceLevel: "Entry" | "Mid" | "Senior" | "Lead";
  employmentType:
    | "Full-Time"
    | "Part-Time"
    | "Contract"
    | "Internship"
    | "Remote";
  location: string;
  category: string;
  skills: string[];
  status: "Active" | "Draft" | "Closed";
  company?: Company;
  recruiterId: string;
  createdAt: string;
}

export interface Application {
  id: string;
  jobId: string;
  userId: string;
  resumeUrl: string;
  coverLetter?: string;
  status: "Pending" | "Reviewing" | "Shortlisted" | "Rejected" | "Accepted";
  appliedAt: string;
}

export interface Recruiter {
  id: string;
  userId: string;
  companyId?: string;
  verified: boolean;
}

export interface SavedJob {
  id: string;
  userId: string;
  jobId: string;
}

/**
 * Auth response types
 */
export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
}

export interface MeResponse {
  user: User;
}

/**
 * List response type with pagination support
 */
export interface ListResponse<T> {
  items: T[];
  total: number;
  page?: number;
  limit?: number;
}
