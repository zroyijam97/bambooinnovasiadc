import { z } from 'zod';

// User and Organization Types
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  role: z.enum(['user', 'admin', 'super_admin']),
  status: z.enum(['active', 'inactive', 'pending']),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const OrganizationSchema = z.object({
  id: z.string(),
  name: z.string(),
  ownerId: z.string(),
  logo: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// VCard Types
export const VCardSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  slug: z.string(),
  templateId: z.string(),
  title: z.string(),
  name: z.string(),
  jobTitle: z.string().optional(),
  company: z.string().optional(),
  bio: z.string().optional(),
  avatar: z.string().optional(),
  banner: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  website: z.string().url().optional(),
  address: z.string().optional(),
  themeConfig: z.record(z.any()),
  fontId: z.string().optional(),
  publishStatus: z.enum(['draft', 'published']),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const BusinessHoursSchema = z.object({
  id: z.string(),
  vcardId: z.string(),
  day: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
  openTime: z.string().optional(),
  closeTime: z.string().optional(),
  isClosed: z.boolean().default(false),
});

export const ServiceSchema = z.object({
  id: z.string(),
  vcardId: z.string(),
  title: z.string(),
  description: z.string().optional(),
  price: z.number().optional(),
  currency: z.string().optional(),
  order: z.number(),
});

export const SocialLinkSchema = z.object({
  id: z.string(),
  vcardId: z.string(),
  platform: z.string(),
  url: z.string().url(),
  order: z.number(),
});

export const TestimonialSchema = z.object({
  id: z.string(),
  vcardId: z.string(),
  name: z.string(),
  avatar: z.string().optional(),
  rating: z.number().min(1).max(5),
  text: z.string(),
  order: z.number(),
});

// Enquiry Types
export const EnquirySchema = z.object({
  id: z.string(),
  vcardId: z.string(),
  name: z.string(),
  email: z.string().email(),
  message: z.string(),
  status: z.enum(['new', 'open', 'closed']),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Template Types
export const TemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  version: z.string(),
  config: z.record(z.any()),
  status: z.enum(['draft', 'live']),
  preview: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Plan and Subscription Types
export const PlanSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  currency: z.string(),
  interval: z.enum(['month', 'year']),
  features: z.record(z.any()),
  templateAllowlist: z.array(z.string()),
  maxCards: z.number(),
  customDomain: z.boolean(),
  analytics: z.boolean(),
  status: z.enum(['active', 'inactive']),
});

export const SubscriptionSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  planId: z.string(),
  status: z.enum(['active', 'canceled', 'past_due', 'trialing']),
  currentPeriodStart: z.date(),
  currentPeriodEnd: z.date(),
  stripeSubscriptionId: z.string().optional(),
});

// Domain Types
export const DomainSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  hostname: z.string(),
  targetSlug: z.string(),
  sslStatus: z.enum(['pending', 'issued', 'error']),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Analytics Types
export const AnalyticsEventSchema = z.object({
  id: z.string(),
  vcardId: z.string(),
  type: z.enum(['view', 'click', 'save', 'enquiry']),
  ipHash: z.string(),
  userAgent: z.string().optional(),
  referrer: z.string().optional(),
  createdAt: z.date(),
});

// Export inferred types
export type User = z.infer<typeof UserSchema>;
export type Organization = z.infer<typeof OrganizationSchema>;
export type VCard = z.infer<typeof VCardSchema>;
export type BusinessHours = z.infer<typeof BusinessHoursSchema>;
export type Service = z.infer<typeof ServiceSchema>;
export type SocialLink = z.infer<typeof SocialLinkSchema>;
export type Testimonial = z.infer<typeof TestimonialSchema>;
export type Enquiry = z.infer<typeof EnquirySchema>;
export type Template = z.infer<typeof TemplateSchema>;
export type Plan = z.infer<typeof PlanSchema>;
export type Subscription = z.infer<typeof SubscriptionSchema>;
export type Domain = z.infer<typeof DomainSchema>;
export type AnalyticsEvent = z.infer<typeof AnalyticsEventSchema>;

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// NFC Types
export interface NFCData {
  url: string;
  type: 'url';
}

export interface NFCWriteResult {
  success: boolean;
  error?: string;
}

export interface NFCReadResult {
  success: boolean;
  data?: NFCData;
  error?: string;
}