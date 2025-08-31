"use strict";
// Utility functions for the shared package
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSlug = generateSlug;
exports.isValidEmail = isValidEmail;
exports.formatPhoneNumber = formatPhoneNumber;
exports.generateQRCodeURL = generateQRCodeURL;
exports.hashIP = hashIP;
exports.isValidURL = isValidURL;
exports.generateVCardFile = generateVCardFile;
/**
 * Generate a random slug for VCards
 */
function generateSlug(name) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        + '-' + Math.random().toString(36).substr(2, 6);
}
/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
/**
 * Format phone number
 */
function formatPhoneNumber(phone) {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    // Format based on length
    if (cleaned.length === 10) {
        return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    }
    else if (cleaned.length === 11) {
        return cleaned.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '$1 ($2) $3-$4');
    }
    return phone; // Return original if format not recognized
}
/**
 * Generate QR code data URL
 */
function generateQRCodeURL(url) {
    // This would typically use a QR code library
    // For now, return a placeholder that can be replaced with actual QR generation
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
}
/**
 * Hash IP address for privacy
 */
function hashIP(ip) {
    // Simple hash function for IP addresses
    let hash = 0;
    for (let i = 0; i < ip.length; i++) {
        const char = ip.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
}
/**
 * Validate URL format
 */
function isValidURL(url) {
    try {
        new URL(url);
        return true;
    }
    catch {
        return false;
    }
}
/**
 * Generate vCard file content
 */
function generateVCardFile(data) {
    let vcard = 'BEGIN:VCARD\nVERSION:3.0\n';
    vcard += `FN:${data.name}\n`;
    if (data.title) {
        vcard += `TITLE:${data.title}\n`;
    }
    if (data.company) {
        vcard += `ORG:${data.company}\n`;
    }
    if (data.phone) {
        vcard += `TEL:${data.phone}\n`;
    }
    if (data.email) {
        vcard += `EMAIL:${data.email}\n`;
    }
    if (data.website) {
        vcard += `URL:${data.website}\n`;
    }
    if (data.address) {
        vcard += `ADR:;;${data.address};;;;\n`;
    }
    vcard += 'END:VCARD';
    return vcard;
}
