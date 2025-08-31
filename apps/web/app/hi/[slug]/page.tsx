'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Phone, Mail, MapPin, Globe, Clock, Star, RefreshCw } from 'lucide-react'
import Image from 'next/image'

interface VCardData {
  id: string
  slug: string
  title: string
  publishStatus: string
  templateId: string
  themeConfig?: any
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

export default function PublicVCardPage() {
  const params = useParams()
  const slug = params.slug as string
  const [vcard, setVcard] = useState<VCardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchVCard = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true)
    }
    try {
      // Add cache-busting parameter to ensure fresh data
      const timestamp = Date.now()
      const response = await fetch(`/api/vcards/${slug}?t=${timestamp}`, {
        cache: 'no-store'
      })
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Card not found')
        } else {
          setError('Failed to load card')
        }
        return
      }

      const data = await response.json()
      setVcard(data)
      setError(null)
    } catch (err) {
      console.error('Error fetching VCard:', err)
      setError('Failed to load card')
    } finally {
      setLoading(false)
      if (isRefresh) {
        setRefreshing(false)
      }
    }
  }

  const handleRefresh = () => {
    fetchVCard(true)
  }

  useEffect(() => {
    if (slug) {
      fetchVCard()
    }
  }, [slug])

  // Auto-refresh when window gains focus
  useEffect(() => {
    const handleFocus = () => {
      if (slug && vcard) {
        fetchVCard(true)
      }
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [slug, vcard])

  const handleContact = (type: 'phone' | 'email') => {
    if (!vcard) return
    
    if (type === 'phone' && vcard.phone) {
      window.open(`tel:${vcard.phone}`, '_self')
    } else if (type === 'email' && vcard.email) {
      window.open(`mailto:${vcard.email}`, '_self')
    }
  }

  const handleWebsite = () => {
    if (vcard?.website) {
      window.open(vcard.website.startsWith('http') ? vcard.website : `https://${vcard.website}`, '_blank')
    }
  }

  const handleSocialLink = (url: string) => {
    window.open(url.startsWith('http') ? url : `https://${url}`, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading card...</p>
        </div>
      </div>
    )
  }

  if (error || !vcard) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Card Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'The requested card could not be found.'}</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="overflow-hidden shadow-lg bg-white rounded-lg">
          {/* Header Section */}
          <div 
            className="h-32 relative"
            style={{ backgroundColor: vcard.themeConfig?.color || '#16a34a' }}
          >
            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="absolute top-4 left-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors disabled:opacity-50"
              title="Refresh card data"
            >
              <RefreshCw 
                className={`w-5 h-5 text-white ${refreshing ? 'animate-spin' : ''}`} 
              />
            </button>
            
            {vcard.banner && (
              <div className="absolute top-4 right-4">
                <Image
                  src={vcard.banner}
                  alt="Company Banner"
                  width={60}
                  height={60}
                  className="rounded-lg bg-white p-2"
                />
              </div>
            )}
          </div>

          <div className="relative px-6 pb-6">
            {/* Profile Photo */}
            {vcard.avatar && (
              <div className="absolute -top-16 left-6">
                <Image
                  src={vcard.avatar}
                  alt={vcard.name}
                  width={120}
                  height={120}
                  className="rounded-full border-4 border-white shadow-lg object-cover"
                />
              </div>
            )}

            <div className={`${vcard.avatar ? 'pt-16' : 'pt-6'}`}>
              {/* Name and Title */}
              <div className="mb-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {vcard.name}
                </h1>
                <p className="text-lg text-gray-600 mb-1">{vcard.jobTitle}</p>
                <p className="text-md text-gray-500">{vcard.company}</p>
              </div>

              {/* Title as Badge */}
              {vcard.title && (
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                    {vcard.title}
                  </span>
                </div>
              )}

              {/* Bio */}
              {vcard.bio && (
                <p className="text-gray-700 mb-6 leading-relaxed">{vcard.bio}</p>
              )}

              {/* Contact Actions */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {vcard.phone && (
                  <button
                    onClick={() => handleContact('phone')}
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-colors"
                    style={{ backgroundColor: vcard.themeConfig?.color || '#16a34a' }}
                  >
                    <Phone size={18} />
                    Call
                  </button>
                )}
                {vcard.email && (
                  <button
                    onClick={() => handleContact('email')}
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    <Mail size={18} />
                    Email
                  </button>
                )}
              </div>

              {/* Contact Information */}
              <div className="space-y-3 mb-6">
                {vcard.email && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Mail size={18} />
                    <span>{vcard.email}</span>
                  </div>
                )}
                {vcard.phone && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Phone size={18} />
                    <span>{vcard.phone}</span>
                  </div>
                )}
                {vcard.website && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Globe size={18} />
                    <button
                      onClick={handleWebsite}
                      className="text-blue-600 hover:underline"
                    >
                      {vcard.website}
                    </button>
                  </div>
                )}
                {vcard.address && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <MapPin size={18} />
                    <span>{vcard.address}</span>
                  </div>
                )}
              </div>

              {/* Business Hours */}
              {vcard.businessHours && vcard.businessHours.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Clock size={18} />
                    Business Hours
                  </h3>
                  <div className="space-y-2">
                    {vcard.businessHours.map((hours, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">{hours.day}</span>
                        <span className="text-gray-900">
                          {!hours.openTime || !hours.closeTime ? 'Closed' : `${hours.openTime} - ${hours.closeTime}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Services */}
              {vcard.services && vcard.services.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Services</h3>
                  <div className="space-y-3">
                    {vcard.services.map((service, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-medium text-gray-900">{service.title}</h4>
                          {service.price && (
                            <span className="text-green-600 font-semibold">{service.currency || '$'}{service.price}</span>
                          )}
                        </div>
                        {service.description && (
                          <p className="text-sm text-gray-600">{service.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Links */}
              {vcard.socialLinks && vcard.socialLinks.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Connect</h3>
                  <div className="flex flex-wrap gap-2">
                    {vcard.socialLinks.map((link, index) => (
                      <button
                        key={index}
                        onClick={() => handleSocialLink(link.url)}
                        className="capitalize px-3 py-1 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        {link.platform}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Testimonials */}
              {vcard.testimonials && vcard.testimonials.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Testimonials</h3>
                  <div className="space-y-4">
                    {vcard.testimonials.map((testimonial, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={`${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <p className="text-gray-700 mb-2">{testimonial.text}</p>
                        <p className="text-sm font-medium text-gray-900">- {testimonial.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Contact Info */}
              {(vcard.address || vcard.website) && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Additional Information</h3>
                  <div className="space-y-2">
                    {vcard.address && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Address:</span>
                        <span className="text-gray-900">{vcard.address}</span>
                      </div>
                    )}
                    {vcard.website && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Website:</span>
                        <span className="text-gray-900">{vcard.website}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}