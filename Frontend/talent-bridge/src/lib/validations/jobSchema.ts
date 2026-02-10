import { z } from 'zod';

export const jobSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  company: z.string().min(2, "Company name is required"),
  location: z.string().min(2, "Location is required"),
  salary: z.string().min(1, "Salary range is required"),
  jobType: z.string().min(1, "Job type is required"),
  // 🚀 FIXED: We removed .default(). It is now strictly a boolean.
  // The form's 'defaultValues' will provide the 'false' starting value.
  isRemote: z.boolean(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  requirements: z.string().min(10, "Requirements must be at least 10 characters"),
});

// Automatically generate the type from the schema so they match 100%
export type JobInput = z.infer<typeof jobSchema>;