export declare const APP_CONFIG: {
    readonly NAME: "BambooInnovasia Digital Cards";
    readonly VERSION: "1.0.0";
    readonly DESCRIPTION: "Modern digital business card platform";
};
export declare const API_ENDPOINTS: {
    readonly AUTH: {
        readonly LOGIN: "/auth/login";
        readonly REGISTER: "/auth/register";
        readonly VERIFY: "/auth/verify";
        readonly REFRESH: "/auth/refresh";
        readonly LOGOUT: "/auth/logout";
    };
    readonly USERS: {
        readonly ME: "/me";
        readonly PROFILE: "/users/profile";
    };
    readonly ORGANIZATIONS: {
        readonly LIST: "/organizations";
        readonly CREATE: "/organizations";
        readonly UPDATE: "/organizations/:id";
        readonly DELETE: "/organizations/:id";
    };
    readonly VCARDS: {
        readonly LIST: "/vcards";
        readonly CREATE: "/vcards";
        readonly GET: "/vcards/:id";
        readonly UPDATE: "/vcards/:id";
        readonly DELETE: "/vcards/:id";
        readonly PUBLISH: "/vcards/:id/publish";
        readonly PUBLIC: "/v/:slug";
    };
    readonly ENQUIRIES: {
        readonly LIST: "/vcards/:id/enquiries";
        readonly CREATE: "/vcards/:id/enquiries";
        readonly UPDATE: "/enquiries/:id";
        readonly DELETE: "/enquiries/:id";
    };
    readonly TEMPLATES: {
        readonly LIST: "/templates";
        readonly GET: "/templates/:id";
    };
    readonly PLANS: {
        readonly LIST: "/plans";
        readonly GET: "/plans/:id";
    };
    readonly SUBSCRIPTIONS: {
        readonly CURRENT: "/subscriptions/current";
        readonly CHECKOUT: "/subscriptions/checkout";
        readonly CANCEL: "/subscriptions/cancel";
    };
    readonly DOMAINS: {
        readonly LIST: "/domains";
        readonly CREATE: "/domains";
        readonly DELETE: "/domains/:id";
        readonly VERIFY: "/domains/:id/verify";
    };
    readonly ANALYTICS: {
        readonly VCARD: "/analytics/vcards/:id";
        readonly OVERVIEW: "/analytics/overview";
    };
    readonly ADMIN: {
        readonly USERS: "/admin/users";
        readonly VCARDS: "/admin/vcards";
        readonly TEMPLATES: "/admin/templates";
        readonly PLANS: "/admin/plans";
        readonly CMS: "/admin/cms";
        readonly SETTINGS: "/admin/settings";
        readonly IMPERSONATE: "/admin/impersonate";
    };
};
export declare const SOCIAL_PLATFORMS: readonly [{
    readonly id: "facebook";
    readonly name: "Facebook";
    readonly icon: "facebook";
    readonly baseUrl: "https://facebook.com/";
}, {
    readonly id: "twitter";
    readonly name: "Twitter";
    readonly icon: "twitter";
    readonly baseUrl: "https://twitter.com/";
}, {
    readonly id: "linkedin";
    readonly name: "LinkedIn";
    readonly icon: "linkedin";
    readonly baseUrl: "https://linkedin.com/in/";
}, {
    readonly id: "instagram";
    readonly name: "Instagram";
    readonly icon: "instagram";
    readonly baseUrl: "https://instagram.com/";
}, {
    readonly id: "youtube";
    readonly name: "YouTube";
    readonly icon: "youtube";
    readonly baseUrl: "https://youtube.com/";
}, {
    readonly id: "tiktok";
    readonly name: "TikTok";
    readonly icon: "tiktok";
    readonly baseUrl: "https://tiktok.com/@";
}, {
    readonly id: "github";
    readonly name: "GitHub";
    readonly icon: "github";
    readonly baseUrl: "https://github.com/";
}, {
    readonly id: "website";
    readonly name: "Website";
    readonly icon: "globe";
    readonly baseUrl: "";
}];
export declare const BUSINESS_DAYS: readonly ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
export declare const CURRENCIES: readonly [{
    readonly code: "USD";
    readonly symbol: "$";
    readonly name: "US Dollar";
}, {
    readonly code: "EUR";
    readonly symbol: "€";
    readonly name: "Euro";
}, {
    readonly code: "GBP";
    readonly symbol: "£";
    readonly name: "British Pound";
}, {
    readonly code: "MYR";
    readonly symbol: "RM";
    readonly name: "Malaysian Ringgit";
}, {
    readonly code: "SGD";
    readonly symbol: "S$";
    readonly name: "Singapore Dollar";
}];
export declare const PLAN_FEATURES: {
    readonly MAX_CARDS: "maxCards";
    readonly CUSTOM_DOMAIN: "customDomain";
    readonly ANALYTICS: "analytics";
    readonly REMOVE_BRANDING: "removeBranding";
    readonly PRIORITY_SUPPORT: "prioritySupport";
    readonly TEAM_MANAGEMENT: "teamManagement";
    readonly API_ACCESS: "apiAccess";
};
export declare const FILE_UPLOAD_LIMITS: {
    readonly AVATAR_MAX_SIZE: number;
    readonly BANNER_MAX_SIZE: number;
    readonly LOGO_MAX_SIZE: number;
    readonly GALLERY_MAX_SIZE: number;
    readonly ALLOWED_IMAGE_TYPES: readonly ["image/jpeg", "image/png", "image/webp"];
};
export declare const ANALYTICS_EVENTS: {
    readonly VIEW: "view";
    readonly CLICK: "click";
    readonly SAVE: "save";
    readonly ENQUIRY: "enquiry";
};
export declare const NFC_CONFIG: {
    readonly RECORD_TYPE: "url";
    readonly MIME_TYPE: "text/plain";
};
export declare const DEFAULT_TEMPLATE_CONFIG: {
    readonly colors: {
        readonly primary: "#3B82F6";
        readonly secondary: "#64748B";
        readonly accent: "#F59E0B";
        readonly background: "#FFFFFF";
        readonly text: "#1F2937";
    };
    readonly fonts: {
        readonly heading: "Inter";
        readonly body: "Inter";
    };
    readonly layout: {
        readonly style: "modern";
        readonly spacing: "normal";
    };
};
