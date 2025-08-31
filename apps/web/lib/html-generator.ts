interface VCardData {
  id: string
  slug: string
  title: string
  publishStatus: string
  templateId: string
  themeConfig?: {
    color?: string
    font?: string
    design?: string
  }
  fontId?: string
  avatar?: string
  banner?: string
  name: string
  jobTitle?: string
  company?: string
  bio?: string
  email?: string
  phone?: string
  website?: string
  address?: string
  businessHours?: Array<{
    id: string
    day: string
    openTime?: string
    closeTime?: string
  }>
  services?: Array<{
    id: string
    title: string
    description?: string
    price?: number
    currency?: string
    order: number
  }>
  socialLinks?: Array<{
    id: string
    platform: string
    url: string
    order: number
  }>
  testimonials?: Array<{
    id: string
    name: string
    avatar?: string
    rating: number
    text: string
    order: number
  }>
}

const getTemplateStyles = (templateId: string, color: string = '#16a34a') => {
  const baseStyles = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #f9fafb;
      min-height: 100vh;
      padding: 2rem 1rem;
    }
    
    .container {
      max-width: 32rem;
      margin: 0 auto;
    }
    
    .card {
      background: white;
      border-radius: 0.5rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    
    .header {
      height: 8rem;
      position: relative;
      background-color: ${color};
    }
    
    .refresh-btn {
      position: absolute;
      top: 1rem;
      left: 1rem;
      padding: 0.5rem;
      background: rgba(255, 255, 255, 0.2);
      border: none;
      border-radius: 50%;
      color: white;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .refresh-btn:hover {
      background: rgba(255, 255, 255, 0.3);
    }
    
    .banner {
      position: absolute;
      top: 1rem;
      right: 1rem;
      width: 3.75rem;
      height: 3.75rem;
      border-radius: 0.5rem;
      background: white;
      padding: 0.5rem;
    }
    
    .banner img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    
    .content {
      position: relative;
      padding: 1.5rem;
    }
    
    .avatar {
      position: absolute;
      top: -4rem;
      left: 1.5rem;
      width: 7.5rem;
      height: 7.5rem;
      border-radius: 50%;
      border: 4px solid white;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      object-fit: cover;
    }
    
    .profile-info {
      padding-top: 4rem;
      margin-bottom: 1rem;
    }
    
    .profile-info.no-avatar {
      padding-top: 1.5rem;
    }
    
    .name {
      font-size: 1.5rem;
      font-weight: bold;
      color: #111827;
      margin-bottom: 0.25rem;
    }
    
    .job-title {
      font-size: 1.125rem;
      color: #4b5563;
      margin-bottom: 0.25rem;
    }
    
    .company {
      color: #6b7280;
    }
    
    .title-badge {
      display: inline-block;
      background: #f3f4f6;
      color: #374151;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.875rem;
      font-weight: 500;
      margin: 1rem 0;
    }
    
    .bio {
      color: #374151;
      line-height: 1.625;
      margin-bottom: 1.5rem;
    }
    
    .contact-actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }
    
    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.2s;
      border: none;
      cursor: pointer;
    }
    
    .btn-primary {
      background-color: ${color};
      color: white;
    }
    
    .btn-secondary {
      background: white;
      color: #374151;
      border: 1px solid #d1d5db;
    }
    
    .btn-secondary:hover {
      background: #f9fafb;
    }
    
    .contact-info {
      margin-bottom: 1.5rem;
    }
    
    .contact-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: #4b5563;
      margin-bottom: 0.75rem;
    }
    
    .contact-item:last-child {
      margin-bottom: 0;
    }
    
    .section {
      margin-bottom: 1.5rem;
    }
    
    .section:last-child {
      margin-bottom: 0;
    }
    
    .section-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #111827;
      margin-bottom: 0.75rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .business-hours {
      display: flex;
      justify-content: space-between;
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
    }
    
    .business-hours:last-child {
      margin-bottom: 0;
    }
    
    .business-day {
      color: #4b5563;
    }
    
    .business-time {
      color: #111827;
    }
    
    .service-item {
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      padding: 0.75rem;
      margin-bottom: 0.75rem;
    }
    
    .service-item:last-child {
      margin-bottom: 0;
    }
    
    .service-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.25rem;
    }
    
    .service-title {
      font-weight: 500;
      color: #111827;
    }
    
    .service-price {
      color: #059669;
      font-weight: 600;
    }
    
    .service-description {
      font-size: 0.875rem;
      color: #4b5563;
    }
    
    .social-links {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    
    .social-link {
      padding: 0.25rem 0.75rem;
      font-size: 0.875rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      color: #374151;
      text-decoration: none;
      text-transform: capitalize;
      transition: background-color 0.2s;
    }
    
    .social-link:hover {
      background: #f9fafb;
    }
    
    .testimonial {
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      padding: 1rem;
      margin-bottom: 1rem;
    }
    
    .testimonial:last-child {
      margin-bottom: 0;
    }
    
    .stars {
      display: flex;
      gap: 0.125rem;
      margin-bottom: 0.5rem;
    }
    
    .star {
      width: 1rem;
      height: 1rem;
      color: #fbbf24;
    }
    
    .star.empty {
      color: #d1d5db;
    }
    
    .testimonial-text {
      color: #374151;
      margin-bottom: 0.5rem;
    }
    
    .testimonial-author {
      font-size: 0.875rem;
      font-weight: 500;
      color: #111827;
    }
    
    .additional-info {
      display: flex;
      justify-content: space-between;
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
    }
    
    .additional-info:last-child {
      margin-bottom: 0;
    }
    
    .info-label {
      color: #4b5563;
    }
    
    .info-value {
      color: #111827;
    }
  `

  // Add template-specific styles
  switch (templateId) {
    case 'flat':
      return baseStyles + `
        .header {
          border-radius: 0;
        }
        .card {
          border-radius: 0;
        }
      `
    case 'modern':
      return baseStyles + `
        .header {
          clip-path: polygon(0 0, 100% 0, 85% 100%, 0 100%);
        }
      `
    default: // classic
      return baseStyles + `
        .header {
          border-radius: 0.5rem 0.5rem 0 0;
        }
      `
  }
}

export function generateVCardHTML(vcard: VCardData): string {
  const color = vcard.themeConfig?.color || '#16a34a'
  const templateId = vcard.templateId || 'classic'
  const styles = getTemplateStyles(templateId, color)

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${vcard.name} - ${vcard.title || 'Digital Business Card'}</title>
  <meta name="description" content="${vcard.bio || `Digital business card for ${vcard.name}`}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    ${styles}
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <!-- Header Section -->
      <div class="header">
        <button class="refresh-btn" onclick="window.location.reload()" title="Refresh card data">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
            <path d="M21 3v5h-5"/>
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
            <path d="M3 21v-5h5"/>
          </svg>
        </button>
        
        ${vcard.banner ? `
        <div class="banner">
          <img src="${vcard.banner}" alt="Company Banner">
        </div>
        ` : ''}
      </div>

      <div class="content">
        ${vcard.avatar ? `
        <img src="${vcard.avatar}" alt="${vcard.name}" class="avatar">
        ` : ''}

        <div class="profile-info ${!vcard.avatar ? 'no-avatar' : ''}">
          <h1 class="name">${vcard.name}</h1>
          ${vcard.jobTitle ? `<p class="job-title">${vcard.jobTitle}</p>` : ''}
          ${vcard.company ? `<p class="company">${vcard.company}</p>` : ''}
        </div>

        ${vcard.title ? `
        <div class="title-badge">${vcard.title}</div>
        ` : ''}

        ${vcard.bio ? `
        <p class="bio">${vcard.bio}</p>
        ` : ''}

        <!-- Contact Actions -->
        <div class="contact-actions">
          ${vcard.phone ? `
          <a href="tel:${vcard.phone}" class="btn btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            Call
          </a>
          ` : ''}
          ${vcard.email ? `
          <a href="mailto:${vcard.email}" class="btn btn-secondary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            Email
          </a>
          ` : ''}
        </div>

        <!-- Contact Information -->
        <div class="contact-info">
          ${vcard.email ? `
          <div class="contact-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <span>${vcard.email}</span>
          </div>
          ` : ''}
          ${vcard.phone ? `
          <div class="contact-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            <span>${vcard.phone}</span>
          </div>
          ` : ''}
          ${vcard.website ? `
          <div class="contact-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            <a href="${vcard.website.startsWith('http') ? vcard.website : `https://${vcard.website}`}" target="_blank" style="color: #2563eb; text-decoration: underline;">
              ${vcard.website}
            </a>
          </div>
          ` : ''}
          ${vcard.address ? `
          <div class="contact-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span>${vcard.address}</span>
          </div>
          ` : ''}
        </div>

        ${vcard.businessHours && vcard.businessHours.length > 0 ? `
        <div class="section">
          <h3 class="section-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>
            Business Hours
          </h3>
          ${vcard.businessHours.map(hours => `
          <div class="business-hours">
            <span class="business-day">${hours.day}</span>
            <span class="business-time">
              ${!hours.openTime || !hours.closeTime ? 'Closed' : `${hours.openTime} - ${hours.closeTime}`}
            </span>
          </div>
          `).join('')}
        </div>
        ` : ''}

        ${vcard.services && vcard.services.length > 0 ? `
        <div class="section">
          <h3 class="section-title">Services</h3>
          ${vcard.services.map(service => `
          <div class="service-item">
            <div class="service-header">
              <h4 class="service-title">${service.title}</h4>
              ${service.price ? `<span class="service-price">${service.currency || '$'}${service.price}</span>` : ''}
            </div>
            ${service.description ? `<p class="service-description">${service.description}</p>` : ''}
          </div>
          `).join('')}
        </div>
        ` : ''}

        ${vcard.socialLinks && vcard.socialLinks.length > 0 ? `
        <div class="section">
          <h3 class="section-title">Connect</h3>
          <div class="social-links">
            ${vcard.socialLinks.map(link => `
            <a href="${link.url.startsWith('http') ? link.url : `https://${link.url}`}" target="_blank" class="social-link">
              ${link.platform}
            </a>
            `).join('')}
          </div>
        </div>
        ` : ''}

        ${vcard.testimonials && vcard.testimonials.length > 0 ? `
        <div class="section">
          <h3 class="section-title">Testimonials</h3>
          ${vcard.testimonials.map(testimonial => `
          <div class="testimonial">
            <div class="stars">
              ${Array.from({ length: 5 }, (_, i) => `
              <svg class="star ${i < testimonial.rating ? '' : 'empty'}" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              `).join('')}
            </div>
            <p class="testimonial-text">${testimonial.text}</p>
            <p class="testimonial-author">- ${testimonial.name}</p>
          </div>
          `).join('')}
        </div>
        ` : ''}

        ${(vcard.address || vcard.website) ? `
        <div class="section">
          <h3 class="section-title">Additional Information</h3>
          ${vcard.address ? `
          <div class="additional-info">
            <span class="info-label">Address:</span>
            <span class="info-value">${vcard.address}</span>
          </div>
          ` : ''}
          ${vcard.website ? `
          <div class="additional-info">
            <span class="info-label">Website:</span>
            <span class="info-value">${vcard.website}</span>
          </div>
          ` : ''}
        </div>
        ` : ''}
      </div>
    </div>
  </div>
</body>
</html>
  `.trim()
}