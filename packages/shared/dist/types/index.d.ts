import { z } from 'zod';
export declare const UserSchema: z.ZodObject<{
    id: z.ZodString;
    email: z.ZodString;
    name: z.ZodString;
    role: z.ZodEnum<["user", "admin", "super_admin"]>;
    status: z.ZodEnum<["active", "inactive", "pending"]>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    email: string;
    name: string;
    role: "user" | "admin" | "super_admin";
    status: "active" | "inactive" | "pending";
    createdAt: Date;
    updatedAt: Date;
}, {
    id: string;
    email: string;
    name: string;
    role: "user" | "admin" | "super_admin";
    status: "active" | "inactive" | "pending";
    createdAt: Date;
    updatedAt: Date;
}>;
export declare const OrganizationSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    ownerId: z.ZodString;
    logo: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    ownerId: string;
    logo?: string | undefined;
}, {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    ownerId: string;
    logo?: string | undefined;
}>;
export declare const VCardSchema: z.ZodObject<{
    id: z.ZodString;
    organizationId: z.ZodString;
    slug: z.ZodString;
    templateId: z.ZodString;
    title: z.ZodString;
    name: z.ZodString;
    jobTitle: z.ZodOptional<z.ZodString>;
    company: z.ZodOptional<z.ZodString>;
    bio: z.ZodOptional<z.ZodString>;
    avatar: z.ZodOptional<z.ZodString>;
    banner: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    website: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodString>;
    themeConfig: z.ZodRecord<z.ZodString, z.ZodAny>;
    fontId: z.ZodOptional<z.ZodString>;
    publishStatus: z.ZodEnum<["draft", "published"]>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    organizationId: string;
    slug: string;
    templateId: string;
    title: string;
    themeConfig: Record<string, any>;
    publishStatus: "draft" | "published";
    email?: string | undefined;
    jobTitle?: string | undefined;
    company?: string | undefined;
    bio?: string | undefined;
    avatar?: string | undefined;
    banner?: string | undefined;
    phone?: string | undefined;
    website?: string | undefined;
    address?: string | undefined;
    fontId?: string | undefined;
}, {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    organizationId: string;
    slug: string;
    templateId: string;
    title: string;
    themeConfig: Record<string, any>;
    publishStatus: "draft" | "published";
    email?: string | undefined;
    jobTitle?: string | undefined;
    company?: string | undefined;
    bio?: string | undefined;
    avatar?: string | undefined;
    banner?: string | undefined;
    phone?: string | undefined;
    website?: string | undefined;
    address?: string | undefined;
    fontId?: string | undefined;
}>;
export declare const BusinessHoursSchema: z.ZodObject<{
    id: z.ZodString;
    vcardId: z.ZodString;
    day: z.ZodEnum<["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]>;
    openTime: z.ZodOptional<z.ZodString>;
    closeTime: z.ZodOptional<z.ZodString>;
    isClosed: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    id: string;
    vcardId: string;
    day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
    isClosed: boolean;
    openTime?: string | undefined;
    closeTime?: string | undefined;
}, {
    id: string;
    vcardId: string;
    day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
    openTime?: string | undefined;
    closeTime?: string | undefined;
    isClosed?: boolean | undefined;
}>;
export declare const ServiceSchema: z.ZodObject<{
    id: z.ZodString;
    vcardId: z.ZodString;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    price: z.ZodOptional<z.ZodNumber>;
    currency: z.ZodOptional<z.ZodString>;
    order: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: string;
    title: string;
    vcardId: string;
    order: number;
    description?: string | undefined;
    price?: number | undefined;
    currency?: string | undefined;
}, {
    id: string;
    title: string;
    vcardId: string;
    order: number;
    description?: string | undefined;
    price?: number | undefined;
    currency?: string | undefined;
}>;
export declare const SocialLinkSchema: z.ZodObject<{
    id: z.ZodString;
    vcardId: z.ZodString;
    platform: z.ZodString;
    url: z.ZodString;
    order: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: string;
    vcardId: string;
    order: number;
    platform: string;
    url: string;
}, {
    id: string;
    vcardId: string;
    order: number;
    platform: string;
    url: string;
}>;
export declare const TestimonialSchema: z.ZodObject<{
    id: z.ZodString;
    vcardId: z.ZodString;
    name: z.ZodString;
    avatar: z.ZodOptional<z.ZodString>;
    rating: z.ZodNumber;
    text: z.ZodString;
    order: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    vcardId: string;
    order: number;
    rating: number;
    text: string;
    avatar?: string | undefined;
}, {
    id: string;
    name: string;
    vcardId: string;
    order: number;
    rating: number;
    text: string;
    avatar?: string | undefined;
}>;
export declare const EnquirySchema: z.ZodObject<{
    id: z.ZodString;
    vcardId: z.ZodString;
    name: z.ZodString;
    email: z.ZodString;
    message: z.ZodString;
    status: z.ZodEnum<["new", "open", "closed"]>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    email: string;
    name: string;
    status: "new" | "open" | "closed";
    message: string;
    createdAt: Date;
    updatedAt: Date;
    vcardId: string;
}, {
    id: string;
    email: string;
    name: string;
    status: "new" | "open" | "closed";
    message: string;
    createdAt: Date;
    updatedAt: Date;
    vcardId: string;
}>;
export declare const TemplateSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    version: z.ZodString;
    config: z.ZodRecord<z.ZodString, z.ZodAny>;
    status: z.ZodEnum<["draft", "live"]>;
    preview: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    status: "draft" | "live";
    createdAt: Date;
    updatedAt: Date;
    version: string;
    config: Record<string, any>;
    preview?: string | undefined;
}, {
    id: string;
    name: string;
    status: "draft" | "live";
    createdAt: Date;
    updatedAt: Date;
    version: string;
    config: Record<string, any>;
    preview?: string | undefined;
}>;
export declare const PlanSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    price: z.ZodNumber;
    currency: z.ZodString;
    interval: z.ZodEnum<["month", "year"]>;
    features: z.ZodRecord<z.ZodString, z.ZodAny>;
    templateAllowlist: z.ZodArray<z.ZodString, "many">;
    maxCards: z.ZodNumber;
    customDomain: z.ZodBoolean;
    analytics: z.ZodBoolean;
    status: z.ZodEnum<["active", "inactive"]>;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    status: "active" | "inactive";
    price: number;
    currency: string;
    interval: "month" | "year";
    features: Record<string, any>;
    templateAllowlist: string[];
    maxCards: number;
    customDomain: boolean;
    analytics: boolean;
}, {
    id: string;
    name: string;
    status: "active" | "inactive";
    price: number;
    currency: string;
    interval: "month" | "year";
    features: Record<string, any>;
    templateAllowlist: string[];
    maxCards: number;
    customDomain: boolean;
    analytics: boolean;
}>;
export declare const SubscriptionSchema: z.ZodObject<{
    id: z.ZodString;
    organizationId: z.ZodString;
    planId: z.ZodString;
    status: z.ZodEnum<["active", "canceled", "past_due", "trialing"]>;
    currentPeriodStart: z.ZodDate;
    currentPeriodEnd: z.ZodDate;
    stripeSubscriptionId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    status: "active" | "canceled" | "past_due" | "trialing";
    organizationId: string;
    planId: string;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    stripeSubscriptionId?: string | undefined;
}, {
    id: string;
    status: "active" | "canceled" | "past_due" | "trialing";
    organizationId: string;
    planId: string;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    stripeSubscriptionId?: string | undefined;
}>;
export declare const DomainSchema: z.ZodObject<{
    id: z.ZodString;
    organizationId: z.ZodString;
    hostname: z.ZodString;
    targetSlug: z.ZodString;
    sslStatus: z.ZodEnum<["pending", "issued", "error"]>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    organizationId: string;
    hostname: string;
    targetSlug: string;
    sslStatus: "pending" | "issued" | "error";
}, {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    organizationId: string;
    hostname: string;
    targetSlug: string;
    sslStatus: "pending" | "issued" | "error";
}>;
export declare const AnalyticsEventSchema: z.ZodObject<{
    id: z.ZodString;
    vcardId: z.ZodString;
    type: z.ZodEnum<["view", "click", "save", "enquiry"]>;
    ipHash: z.ZodString;
    userAgent: z.ZodOptional<z.ZodString>;
    referrer: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    type: "view" | "click" | "save" | "enquiry";
    createdAt: Date;
    vcardId: string;
    ipHash: string;
    userAgent?: string | undefined;
    referrer?: string | undefined;
}, {
    id: string;
    type: "view" | "click" | "save" | "enquiry";
    createdAt: Date;
    vcardId: string;
    ipHash: string;
    userAgent?: string | undefined;
    referrer?: string | undefined;
}>;
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
