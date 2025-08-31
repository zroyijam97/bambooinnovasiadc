// Application constants

export const APP_CONFIG = {
  NAME: 'BambooInnovasia Digital Cards',
  VERSION: '1.0.0',
  DESCRIPTION: 'Modern digital business card platform',
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    VERIFY: '/auth/verify',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
  USERS: {
    ME: '/me',
    PROFILE: '/users/profile',
  },
  ORGANIZATIONS: {
    LIST: '/organizations',
    CREATE: '/organizations',
    UPDATE: '/organizations/:id',
    DELETE: '/organizations/:id',
  },
  VCARDS: {
    LIST: '/vcards',
    CREATE: '/vcards',
    GET: '/vcards/:id',
    UPDATE: '/vcards/:id',
    DELETE: '/vcards/:id',
    PUBLISH: '/vcards/:id/publish',
    PUBLIC: '/v/:slug',
  },
  ENQUIRIES: {
    LIST: '/vcards/:id/enquiries',
    CREATE: '/vcards/:id/enquiries',
    UPDATE: '/enquiries/:id',
    DELETE: '/enquiries/:id',
  },
  TEMPLATES: {
    LIST: '/templates',
    GET: '/templates/:id',
  },
  PLANS: {
    LIST: '/plans',
    GET: '/plans/:id',
  },
  SUBSCRIPTIONS: {
    CURRENT: '/subscriptions/current',
    CHECKOUT: '/subscriptions/checkout',
    CANCEL: '/subscriptions/cancel',
  },
  DOMAINS: {
    LIST: '/domains',
    CREATE: '/domains',
    DELETE: '/domains/:id',
    VERIFY: '/domains/:id/verify',
  },
  ANALYTICS: {
    VCARD: '/analytics/vcards/:id',
    OVERVIEW: '/analytics/overview',
  },
  ADMIN: {
    USERS: '/admin/users',
    VCARDS: '/admin/vcards',
    TEMPLATES: '/admin/templates',
    PLANS: '/admin/plans',
    CMS: '/admin/cms',
    SETTINGS: '/admin/settings',
    IMPERSONATE: '/admin/impersonate',
  },
} as const;

export const SOCIAL_PLATFORMS = [
  { id: 'facebook', name: 'Facebook', icon: 'facebook', baseUrl: 'https://facebook.com/' },
  { id: 'twitter', name: 'Twitter', icon: 'twitter', baseUrl: 'https://twitter.com/' },
  { id: 'linkedin', name: 'LinkedIn', icon: 'linkedin', baseUrl: 'https://linkedin.com/in/' },
  { id: 'instagram', name: 'Instagram', icon: 'instagram', baseUrl: 'https://instagram.com/' },
  { id: 'youtube', name: 'YouTube', icon: 'youtube', baseUrl: 'https://youtube.com/' },
  { id: 'tiktok', name: 'TikTok', icon: 'tiktok', baseUrl: 'https://tiktok.com/@' },
  { id: 'github', name: 'GitHub', icon: 'github', baseUrl: 'https://github.com/' },
  { id: 'website', name: 'Website', icon: 'globe', baseUrl: '' },
] as const;

export const BUSINESS_DAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
] as const;

export const PLAN_FEATURES = {
  MAX_CARDS: 'maxCards',
  CUSTOM_DOMAIN: 'customDomain',
  ANALYTICS: 'analytics',
  REMOVE_BRANDING: 'removeBranding',
  PRIORITY_SUPPORT: 'prioritySupport',
  TEAM_MANAGEMENT: 'teamManagement',
  API_ACCESS: 'apiAccess',
} as const;

export const FILE_UPLOAD_LIMITS = {
  AVATAR_MAX_SIZE: 2 * 1024 * 1024, // 2MB
  BANNER_MAX_SIZE: 5 * 1024 * 1024, // 5MB
  LOGO_MAX_SIZE: 1 * 1024 * 1024, // 1MB
  GALLERY_MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
} as const;

export const ANALYTICS_EVENTS = {
  VIEW: 'view',
  CLICK: 'click',
  SAVE: 'save',
  ENQUIRY: 'enquiry',
} as const;

export const NFC_CONFIG = {
  RECORD_TYPE: 'url',
  MIME_TYPE: 'text/plain',
} as const;

export const DEFAULT_TEMPLATE_CONFIG = {
  colors: {
    primary: '#3B82F6',
    secondary: '#64748B',
    accent: '#F59E0B',
    background: '#FFFFFF',
    text: '#1F2937',
  },
  fonts: {
    heading: 'Inter',
    body: 'Inter',
  },
  layout: {
    style: 'modern',
    spacing: 'normal',
  },
} as const;