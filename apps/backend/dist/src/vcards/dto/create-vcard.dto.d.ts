export declare class CreateBusinessHoursDto {
    day: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
    openTime?: string;
    closeTime?: string;
    isClosed?: boolean;
}
export declare class CreateServiceDto {
    title: string;
    description?: string;
    price?: number;
    currency?: string;
    order: number;
}
export declare class CreateSocialLinkDto {
    platform: string;
    url: string;
    order: number;
}
export declare class CreateTestimonialDto {
    name: string;
    avatar?: string;
    rating: number;
    text: string;
    order: number;
}
export declare class CreateVCardDto {
    slug: string;
    templateId: string;
    title: string;
    name: string;
    jobTitle?: string;
    company?: string;
    bio?: string;
    avatar?: string;
    banner?: string;
    phone?: string;
    email?: string;
    website?: string;
    address?: string;
    themeConfig?: Record<string, any>;
    fontId?: string;
    publishStatus?: 'DRAFT' | 'PUBLISHED';
    businessHours?: CreateBusinessHoursDto[];
    services?: CreateServiceDto[];
    socialLinks?: CreateSocialLinkDto[];
    testimonials?: CreateTestimonialDto[];
}
