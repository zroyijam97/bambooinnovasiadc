/**
 * Generate a random slug for VCards
 */
export declare function generateSlug(name: string): string;
/**
 * Validate email format
 */
export declare function isValidEmail(email: string): boolean;
/**
 * Format phone number
 */
export declare function formatPhoneNumber(phone: string): string;
/**
 * Generate QR code data URL
 */
export declare function generateQRCodeURL(url: string): string;
/**
 * Hash IP address for privacy
 */
export declare function hashIP(ip: string): string;
/**
 * Validate URL format
 */
export declare function isValidURL(url: string): boolean;
/**
 * Generate vCard file content
 */
export declare function generateVCardFile(data: {
    name: string;
    title?: string;
    company?: string;
    phone?: string;
    email?: string;
    website?: string;
    address?: string;
}): string;
