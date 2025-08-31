export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    VERIFY: '/auth/verify',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    CHANGE_PASSWORD: '/auth/change-password',
    VERIFY_EMAIL: '/auth/verify-email',
    RESEND_VERIFICATION: '/auth/resend-verification',
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
    ORGANIZATIONS: '/admin/organizations',
    PLANS: '/admin/plans',
    SUBSCRIPTIONS: '/admin/subscriptions',
  },
} as const;