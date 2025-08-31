"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsEventSchema = exports.DomainSchema = exports.SubscriptionSchema = exports.PlanSchema = exports.TemplateSchema = exports.EnquirySchema = exports.TestimonialSchema = exports.SocialLinkSchema = exports.ServiceSchema = exports.BusinessHoursSchema = exports.VCardSchema = exports.OrganizationSchema = exports.UserSchema = void 0;
const zod_1 = require("zod");
// User and Organization Types
exports.UserSchema = zod_1.z.object({
    id: zod_1.z.string(),
    email: zod_1.z.string().email(),
    name: zod_1.z.string(),
    role: zod_1.z.enum(['user', 'admin', 'super_admin']),
    status: zod_1.z.enum(['active', 'inactive', 'pending']),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
exports.OrganizationSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    ownerId: zod_1.z.string(),
    logo: zod_1.z.string().optional(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
// VCard Types
exports.VCardSchema = zod_1.z.object({
    id: zod_1.z.string(),
    organizationId: zod_1.z.string(),
    slug: zod_1.z.string(),
    templateId: zod_1.z.string(),
    title: zod_1.z.string(),
    name: zod_1.z.string(),
    jobTitle: zod_1.z.string().optional(),
    company: zod_1.z.string().optional(),
    bio: zod_1.z.string().optional(),
    avatar: zod_1.z.string().optional(),
    banner: zod_1.z.string().optional(),
    phone: zod_1.z.string().optional(),
    email: zod_1.z.string().email().optional(),
    website: zod_1.z.string().url().optional(),
    address: zod_1.z.string().optional(),
    themeConfig: zod_1.z.record(zod_1.z.any()),
    fontId: zod_1.z.string().optional(),
    publishStatus: zod_1.z.enum(['draft', 'published']),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
exports.BusinessHoursSchema = zod_1.z.object({
    id: zod_1.z.string(),
    vcardId: zod_1.z.string(),
    day: zod_1.z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
    openTime: zod_1.z.string().optional(),
    closeTime: zod_1.z.string().optional(),
    isClosed: zod_1.z.boolean().default(false),
});
exports.ServiceSchema = zod_1.z.object({
    id: zod_1.z.string(),
    vcardId: zod_1.z.string(),
    title: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    price: zod_1.z.number().optional(),
    currency: zod_1.z.string().optional(),
    order: zod_1.z.number(),
});
exports.SocialLinkSchema = zod_1.z.object({
    id: zod_1.z.string(),
    vcardId: zod_1.z.string(),
    platform: zod_1.z.string(),
    url: zod_1.z.string().url(),
    order: zod_1.z.number(),
});
exports.TestimonialSchema = zod_1.z.object({
    id: zod_1.z.string(),
    vcardId: zod_1.z.string(),
    name: zod_1.z.string(),
    avatar: zod_1.z.string().optional(),
    rating: zod_1.z.number().min(1).max(5),
    text: zod_1.z.string(),
    order: zod_1.z.number(),
});
// Enquiry Types
exports.EnquirySchema = zod_1.z.object({
    id: zod_1.z.string(),
    vcardId: zod_1.z.string(),
    name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    message: zod_1.z.string(),
    status: zod_1.z.enum(['new', 'open', 'closed']),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
// Template Types
exports.TemplateSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    version: zod_1.z.string(),
    config: zod_1.z.record(zod_1.z.any()),
    status: zod_1.z.enum(['draft', 'live']),
    preview: zod_1.z.string().optional(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
// Plan and Subscription Types
exports.PlanSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    price: zod_1.z.number(),
    currency: zod_1.z.string(),
    interval: zod_1.z.enum(['month', 'year']),
    features: zod_1.z.record(zod_1.z.any()),
    templateAllowlist: zod_1.z.array(zod_1.z.string()),
    maxCards: zod_1.z.number(),
    customDomain: zod_1.z.boolean(),
    analytics: zod_1.z.boolean(),
    status: zod_1.z.enum(['active', 'inactive']),
});
exports.SubscriptionSchema = zod_1.z.object({
    id: zod_1.z.string(),
    organizationId: zod_1.z.string(),
    planId: zod_1.z.string(),
    status: zod_1.z.enum(['active', 'canceled', 'past_due', 'trialing']),
    currentPeriodStart: zod_1.z.date(),
    currentPeriodEnd: zod_1.z.date(),
    stripeSubscriptionId: zod_1.z.string().optional(),
});
// Domain Types
exports.DomainSchema = zod_1.z.object({
    id: zod_1.z.string(),
    organizationId: zod_1.z.string(),
    hostname: zod_1.z.string(),
    targetSlug: zod_1.z.string(),
    sslStatus: zod_1.z.enum(['pending', 'issued', 'error']),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
// Analytics Types
exports.AnalyticsEventSchema = zod_1.z.object({
    id: zod_1.z.string(),
    vcardId: zod_1.z.string(),
    type: zod_1.z.enum(['view', 'click', 'save', 'enquiry']),
    ipHash: zod_1.z.string(),
    userAgent: zod_1.z.string().optional(),
    referrer: zod_1.z.string().optional(),
    createdAt: zod_1.z.date(),
});
