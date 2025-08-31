'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/layout/dashboard-layout'

// Custom CSS for head section shapes
const customStyles = `
  .clip-diagonal {
    clip-path: polygon(0 0, 100% 0, 85% 100%, 0 100%);
  }
  .wave-shape {
    clip-path: polygon(0 0, 100% 0, 100% 75%, 75% 85%, 50% 95%, 25% 85%, 0 75%);
    border-radius: 0 0 30px 30px;
  }
  .triangle-shape {
    clip-path: polygon(0 0, 100% 0, 100% 70%, 50% 95%, 0 70%);
    border-radius: 0 0 25px 25px;
  }
  .organic-shape {
    clip-path: polygon(0 0, 100% 0, 100% 65%, 85% 75%, 70% 85%, 50% 90%, 30% 85%, 15% 75%, 0 65%);
    border-radius: 0 0 35px 35px;
  }
  .zigzag-shape {
    clip-path: polygon(0 0, 100% 0, 100% 80%, 90% 100%, 80% 80%, 70% 100%, 60% 80%, 50% 100%, 40% 80%, 30% 100%, 20% 80%, 10% 100%, 0 80%);
  }
  .arch-shape {
    clip-path: polygon(0 0, 100% 0, 100% 50%, 75% 70%, 50% 85%, 25% 70%, 0 50%);
    border-radius: 0 0 50px 50px;
  }
  .split-shape {
    clip-path: polygon(0 0, 70% 0, 85% 20%, 100% 100%, 0 100%);
    border-radius: 0 0 20px 0;
  }
  .bubble-shape {
    clip-path: polygon(0 0, 100% 0, 100% 65%, 90% 75%, 75% 85%, 50% 90%, 25% 85%, 10% 75%, 0 65%);
    border-radius: 0 0 45px 45px;
  }
  .stepped-shape {
    clip-path: polygon(0 0, 100% 0, 100% 60%, 80% 60%, 80% 80%, 60% 80%, 60% 100%, 40% 100%, 40% 80%, 20% 80%, 20% 60%, 0 60%);
  }
  .splash-shape {
    clip-path: polygon(0 0, 100% 0, 100% 65%, 95% 75%, 85% 85%, 75% 95%, 65% 100%, 35% 100%, 25% 95%, 15% 85%, 5% 75%, 0 65%);
  }
  .curvy-shape {
    clip-path: polygon(0 0, 100% 0, 100% 40%, 90% 50%, 80% 60%, 70% 70%, 60% 80%, 50% 85%, 40% 80%, 30% 70%, 20% 60%, 10% 50%, 0 40%);
    border-radius: 0 0 60px 60px;
  }
  .blend-shape {
    clip-path: polygon(0 0, 100% 0, 100% 45%, 95% 55%, 85% 65%, 75% 75%, 65% 82%, 50% 88%, 35% 82%, 25% 75%, 15% 65%, 5% 55%, 0 45%);
    border-radius: 0 0 50px 50px;
  }
`

interface FieldData {
  id: string
  name: string
  value?: string
  icon?: string
  title?: string
  description?: string
  link?: string
  backgroundColor?: string
  mediaType?: 'text' | 'image' | 'video'
  mediaUrl?: string
}

interface CardData {
  design: string
  profilePhoto: string | null
  profilePhotoCrop: {
    x: number
    y: number
    scale: number
  } | null
  color: string
  font: string
  logo: string | null
  badges: string[]
  prefix: string
  firstName: string
  middleName: string
  lastName: string
  suffix: string
  accreditations: string
  preferredName: string
  maidenName: string
  pronouns: string
  title: string
  department: string
  company: string
  headline: string
  fields: FieldData[]
  cardName: string
  slug: string
}

export default function NewCardPage() {
  const { isLoaded, user } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()
  const editSlug = searchParams.get('edit')
  const [activeTab, setActiveTab] = useState('display')
  const [showCropModal, setShowCropModal] = useState(false)
  const [tempPhoto, setTempPhoto] = useState<string | null>(null)
  const [cropData, setCropData] = useState({ x: 0, y: 0, scale: 1 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [debugMode, setDebugMode] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [lastError, setLastError] = useState<string | null>(null)
  const [slugError, setSlugError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoadingCard, setIsLoadingCard] = useState(false)
  const [cardData, setCardData] = useState<CardData>({
    // Display data
    design: 'classic',
    profilePhoto: null,
    profilePhotoCrop: null,
    color: '#10B981',
    font: 'Inter',
    logo: null,
    badges: [],
    
    // Information data
    prefix: '',
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    accreditations: '',
    preferredName: '',
    maidenName: '',
    pronouns: '',
    title: '',
    department: '',
    company: '',
    headline: '',
    
    // Fields data
    fields: [],
    
    // Card data
    cardName: '',
    slug: ''
  })
  


  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/sign-in')
    }
  }, [isLoaded, user, router])

  // State to store the card ID for editing
  const [editCardId, setEditCardId] = useState<string | null>(null)

  // Function to load existing card data for editing
  const loadCardData = async (slug: string) => {
    setIsLoadingCard(true)
    try {
      // First, get all cards and find the one with matching slug
      const response = await fetch('/api/vcards')
      if (!response.ok) {
        throw new Error('Failed to load cards')
      }
      const cards = await response.json()
      const targetCard = cards.find((card: any) => card.slug === slug)
      
      if (!targetCard) {
        throw new Error('Card not found')
      }
      
      // Store the card ID for later use in update
      setEditCardId(targetCard.id)
      
      // Transform backend data to frontend format
      setCardData({
        design: targetCard.templateId || targetCard.themeConfig?.design || 'classic',
        profilePhoto: targetCard.avatar || null,
        profilePhotoCrop: null,
        color: targetCard.themeConfig?.color || '#10B981',
        font: targetCard.themeConfig?.font || 'Inter',
        logo: targetCard.banner || null,
        badges: [],
        prefix: '',
        firstName: targetCard.name?.split(' ')[0] || '',
        middleName: '',
        lastName: targetCard.name?.split(' ').slice(1).join(' ') || '',
        suffix: '',
        accreditations: '',
        preferredName: '',
        maidenName: '',
        pronouns: '',
        title: targetCard.jobTitle || '',
        department: '',
        company: targetCard.company || '',
        headline: targetCard.bio || '',
        fields: [
          ...(targetCard.phone ? [{ id: 'phone', name: 'phone', value: targetCard.phone }] : []),
          ...(targetCard.email ? [{ id: 'email', name: 'email', value: targetCard.email }] : []),
          ...(targetCard.website ? [{ id: 'website', name: 'website', value: targetCard.website }] : []),
          ...(targetCard.address ? [{ id: 'address', name: 'address', value: targetCard.address }] : []),
          ...(targetCard.socialLinks || []).map((link: any) => ({
            id: link.platform,
            name: link.platform,
            value: link.url
          }))
        ],
        cardName: targetCard.title || '',
        slug: targetCard.slug || ''
      })
    } catch (error) {
      console.error('Error loading card data:', error)
      alert('Failed to load card data for editing')
      router.push('/dashboard')
    } finally {
      setIsLoadingCard(false)
    }
  }

  // Load card data when in edit mode
  useEffect(() => {
    if (editSlug && isLoaded && user) {
      loadCardData(editSlug)
    }
  }, [editSlug, isLoaded, user])

  if (!isLoaded || !user || isLoadingCard) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-700">{isLoadingCard ? 'Loading card data...' : 'Loading...'}</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'display', label: 'Display', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> },
    { id: 'information', label: 'Information', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg> },
    { id: 'fields', label: 'Fields', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg> },
    { id: 'card', label: 'Card', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg> }
  ]

  const designs = [
    { id: 'classic', name: 'Classic', preview: 'bg-green-500', headStyle: 'curved-bottom' },
    { id: 'flat', name: 'Flat', preview: 'bg-emerald-600', headStyle: 'flat-top' },
    { id: 'modern', name: 'Modern', preview: 'bg-green-600', headStyle: 'diagonal-cut' },
    { id: 'sleek', name: 'Sleek', preview: 'bg-teal-700', headStyle: 'wave-bottom' },
    { id: 'blend', name: 'Blend', preview: 'bg-green-400', headStyle: 'blend-bottom' },
    { id: 'curvy', name: 'Curvy', preview: 'bg-emerald-500', headStyle: 'curvy-bottom' },
    { id: 'geometric', name: 'Geometric', preview: 'bg-green-700', headStyle: 'triangle-cut' },
    { id: 'organic', name: 'Organic', preview: 'bg-teal-500', headStyle: 'organic-curve' },
    { id: 'minimal', name: 'Minimal', preview: 'bg-green-800', headStyle: 'clean-line' },
    { id: 'dynamic', name: 'Dynamic', preview: 'bg-lime-500', headStyle: 'zigzag-bottom' },
    { id: 'elegant', name: 'Elegant', preview: 'bg-emerald-400', headStyle: 'arch-bottom' },
    { id: 'bold', name: 'Bold', preview: 'bg-green-900', headStyle: 'split-diagonal' },
    { id: 'creative', name: 'Creative', preview: 'bg-teal-600', headStyle: 'bubble-cut' },
    { id: 'professional', name: 'Professional', preview: 'bg-emerald-800', headStyle: 'stepped-bottom' },
    { id: 'artistic', name: 'Artistic', preview: 'bg-emerald-500', headStyle: 'paint-splash' }
  ]

  const colors = [
    '#10B981', '#059669', '#047857', '#065F46', '#064E3B',
    '#34D399', '#6EE7B7', '#A7F3D0', '#22C55E', '#16A34A'
  ]

  const fonts = [
    { id: 'inter', name: 'Inter' },
    { id: 'roboto', name: 'Roboto' },
    { id: 'opensans', name: 'Open Sans' },
    { id: 'lato', name: 'Lato' },
    { id: 'montserrat', name: 'Montserrat' },
    { id: 'merriweather', name: 'Merriweather' },
    { id: 'librebaskerville', name: 'Libre Baskerville' },
    { id: 'playfair', name: 'Playfair Display' },
    { id: 'sourcesans', name: 'Source Sans Pro' },
    { id: 'nunito', name: 'Nunito Sans' },
    { id: 'poppins', name: 'Poppins' },
    { id: 'raleway', name: 'Raleway' },
    { id: 'ubuntu', name: 'Ubuntu' },
    { id: 'oswald', name: 'Oswald' },
    { id: 'ptserif', name: 'PT Serif' },
    { id: 'crimsontext', name: 'Crimson Text' },
    { id: 'dmsans', name: 'DM Sans' },
    { id: 'worksans', name: 'Work Sans' },
    { id: 'firasans', name: 'Fira Sans' },
    { id: 'ibmplexsans', name: 'IBM Plex Sans' }
  ]

  const fieldCategories = {
    'Most Popular': [
      { id: 'website', name: 'Website', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg> },
      { id: 'email', name: 'Email', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg> },
      { id: 'phone', name: 'Phone', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg> },
      { id: 'linkedin', name: 'LinkedIn', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/></svg> },
      { id: 'instagram', name: 'Instagram', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/></svg> }
    ],
    'Social': [
      { id: 'facebook', name: 'Facebook', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
      { id: 'instagram', name: 'Instagram', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/></svg> },
      { id: 'twitter', name: 'X.com', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
      { id: 'snapchat', name: 'Snapchat', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-12C24.007 5.367 18.641.001.012.001z"/></svg> },
      { id: 'linkedin', name: 'LinkedIn', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/></svg> },
      { id: 'pinterest', name: 'Pinterest', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-12C24.007 5.367 18.641.001.012.001z"/></svg> },
      { id: 'threads', name: 'Threads', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.5 12.01 1.5 8.434 2.35 5.58 3.995 3.529 5.845 1.225 8.598.044 12.179.02h.014c3.581.024 6.334 1.205 8.184 3.509C21.65 5.58 22.5 8.434 22.5 12.01c0 3.576-.85 6.43-2.495 8.481-1.85 2.304-4.603 3.485-8.184 3.509z"/></svg> },
      { id: 'tiktok', name: 'TikTok', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg> },
      { id: 'xing', name: 'Xing', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.188 0c-.517 0-.741.325-.927.66 0 0-7.455 13.224-7.702 13.657.284.52 4.56 8.668 4.56 8.668.214.364.52.715 1.005.715h2.756c.312 0 .6-.154.741-.406.14-.251.132-.85-.108-1.204 0 0-4.307-8.18-4.307-8.18s7.49-13.28 7.49-13.28c.26-.365.271-.645.108-.889C21.681.154 21.188 0 20.876 0h-2.688z"/></svg> }
    ],
    'Communication': [
      { id: 'whatsapp', name: 'WhatsApp', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.488"/></svg> },
      { id: 'telegram', name: 'Telegram', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg> },
      { id: 'discord', name: 'Discord', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0190 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z"/></svg> },
      { id: 'wechat', name: 'WeChat', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18 0 .659-.52 1.188-1.162 1.188-.642 0-1.162-.529-1.162-1.188 0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18 0 .659-.52 1.188-1.162 1.188-.642 0-1.162-.529-1.162-1.188 0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.045c.134 0 .24-.111.24-.248 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.858zm-3.288 1.995c.464 0 .840.385.840.86 0 .474-.376.86-.84.86-.464 0-.84-.386-.84-.86 0-.475.376-.86.84-.86zm4.462 0c.464 0 .84.385.84.86 0 .474-.376.86-.84.86-.464 0-.84-.386-.84-.86 0-.475.376-.86.84-.86z"/></svg> },
      { id: 'line', name: 'Line', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/></svg> },
      { id: 'signal', name: 'Signal', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.013 2.25c5.385 0 9.75 4.365 9.75 9.75s-4.365 9.75-9.75 9.75-9.75-4.365-9.75-9.75 4.365-9.75 9.75-9.75zm0 1.5a8.25 8.25 0 100 16.5 8.25 8.25 0 000-16.5zM8.457 12.75l3.75-3.75 3.75 3.75H8.457z"/></svg> },
      { id: 'email', name: 'Email', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg> },
      { id: 'phone', name: 'Phone', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg> }
    ],
    'Conferencing': [
      { id: 'zoom', name: 'Zoom', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6.5 6.5h11v11h-11z"/><path d="M2 2v20h20V2H2zm18 18H4V4h16v16z"/></svg> },
      { id: 'teams', name: 'Teams', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/></svg> },
      { id: 'meet', name: 'Meet', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6.5 6.5h11v11h-11z"/><path d="M2 2v20h20V2H2zm18 18H4V4h16v16z"/></svg> },
      { id: 'skype', name: 'Skype', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/></svg> },
      { id: 'webex', name: 'Webex', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6.5 6.5h11v11h-11z"/><path d="M2 2v20h20V2H2zm18 18H4V4h16v16z"/></svg> }
    ],
    'Payment': [
      { id: 'venmo', name: 'Venmo', icon: '💳' },
      { id: 'paypal', name: 'PayPal', icon: '💰' },
      { id: 'cashapp', name: 'Cash App', icon: '💵' },
      { id: 'zelle', name: 'Zelle', icon: '💸' }
    ],
    'Video': [
      { id: 'youtube', name: 'YouTube', icon: '📺' },
      { id: 'vimeo', name: 'Vimeo', icon: '🎬' },
      { id: 'tiktok', name: 'TikTok', icon: '🎵' },
      { id: 'twitch', name: 'Twitch', icon: '🎮' },
      { id: 'brightcove', name: 'Brightcove', icon: '📹' }
    ],
    'Music': [
      { id: 'spotify', name: 'Spotify', icon: '🎵' },
      { id: 'applemusic', name: 'Apple Music', icon: '🎶' },
      { id: 'soundcloud', name: 'SoundCloud', icon: '🔊' }
    ],
    'Design': [
      { id: 'behance', name: 'Behance', icon: '🎨' },
      { id: 'dribbble', name: 'Dribbble', icon: '🏀' }
    ],
    'Gaming': [
      { id: 'psn', name: 'PSN', icon: '🎮' },
      { id: 'xbox', name: 'Xbox Live', icon: '🎮' },
      { id: 'nintendo', name: 'Nintendo', icon: '🎮' },
      { id: 'twitch', name: 'Twitch', icon: '🎮' }
    ],
    'Other': [
      { id: 'website', name: 'Website', icon: '🌐' },
      { id: 'link', name: 'Link', icon: '🔗' },
      { id: 'github', name: 'GitHub', icon: '💻' },
      { id: 'calendly', name: 'Calendly', icon: '📅' },
      { id: 'pdf', name: 'PDF', icon: '📄' },
      { id: 'patreon', name: 'Patreon', icon: '🎭' },
      { id: 'bookings', name: 'Bookings', icon: '📅' },
      { id: 'note', name: 'Note', icon: '📝' },
      { id: 'yelp', name: 'Yelp', icon: '⭐' },
      { id: 'address', name: 'Address', icon: '📍' },
      { id: 'date', name: 'Important Date', icon: '📅' }
    ]
  }

  const addField = (fieldId: string, fieldName: string) => {
    if (!cardData.fields.find(f => f.id === fieldId)) {
      setCardData(prev => ({
        ...prev,
        fields: [...prev.fields, { id: fieldId, name: fieldName, value: '' }]
      }))
    }
  }

  const removeField = (fieldId: string) => {
    setCardData(prev => ({
      ...prev,
      fields: prev.fields.filter(f => f.id !== fieldId)
    }))
  }

  const updateFieldValue = (fieldId: string, property: string, value: string) => {
    setCardData(prev => ({
      ...prev,
      fields: prev.fields.map(f => f.id === fieldId ? { ...f, [property]: value } : f)
    }))
  }

  const handleIconUpload = (fieldId: string, file: File) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      updateFieldValue(fieldId, 'icon', result)
    }
    reader.readAsDataURL(file)
  }

  const handleMediaUpload = (fieldId: string, file: File, mediaType: 'image' | 'video') => {
    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      updateFieldValue(fieldId, 'mediaUrl', result)
      updateFieldValue(fieldId, 'mediaType', mediaType)
    }
    reader.readAsDataURL(file)
  }

  const moveField = (fromIndex: number, toIndex: number) => {
    setCardData(prev => {
      const newFields = [...prev.fields]
      const [movedField] = newFields.splice(fromIndex, 1)
      newFields.splice(toIndex, 0, movedField)
      return { ...prev, fields: newFields }
    })
  }

  const renderDisplayTab = () => (
    <div className="space-y-8">
      {/* Design Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">🎋 Design</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {designs.map((design) => (
            <button
              key={design.id}
              onClick={() => setCardData(prev => ({ ...prev, design: design.id }))}
              className={`relative p-3 rounded-lg border-2 transition-all ${
                cardData.design === design.id
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="w-full h-16 rounded-lg overflow-hidden bg-white shadow-sm relative">
                 {/* Head Section */}
                 <div className="relative h-10">
                   {/* Color Background */}
                   <div 
                     className="absolute inset-0"
                     style={{ backgroundColor: cardData.color || '#8B5CF6' }}
                   ></div>
                   
                   {/* Profile Photo with Design Shape */}
                   <div className={`absolute inset-0 ${
                     design.headStyle === 'curved-bottom' ? 'rounded-b-lg' :
                     design.headStyle === 'flat-top' ? '' :
                     design.headStyle === 'diagonal-cut' ? 'clip-diagonal' :
                     design.headStyle === 'wave-bottom' ? 'wave-shape' :
                     design.headStyle === 'blend-bottom' ? 'blend-shape' :
                     design.headStyle === 'curvy-bottom' ? 'curvy-shape' :
                     design.headStyle === 'triangle-cut' ? 'triangle-shape' :
                     design.headStyle === 'organic-curve' ? 'organic-shape' :
                     design.headStyle === 'clean-line' ? '' :
                     design.headStyle === 'zigzag-bottom' ? 'zigzag-shape' :
                     design.headStyle === 'arch-bottom' ? 'arch-shape' :
                     design.headStyle === 'split-diagonal' ? 'split-shape' :
                     design.headStyle === 'bubble-cut' ? 'bubble-shape' :
                     design.headStyle === 'stepped-bottom' ? 'stepped-shape' :
                     'splash-shape'
                   } overflow-hidden`}>
                     <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                       <div className="text-white text-xs opacity-50">👤</div>
                     </div>
                   </div>
                 </div>
                 
                 {/* Body Section */}
                 <div className="h-6 bg-white flex items-center px-2">
                   <div className="flex space-x-1">
                     <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                     <div className="w-2 h-1 bg-gray-300 rounded-full"></div>
                     <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                   </div>
                 </div>
              </div>
              <div className="mt-2 text-xs font-medium text-center text-gray-700">{design.name}</div>
              {design.id !== 'classic' && (
                <div className="absolute top-1 right-1 bg-gray-800 text-white text-xs px-1 py-0.5 rounded text-[10px] font-medium">
                  PRO
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Profile Photo */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">🌿 Profile Photo</h3>
        <div className="flex items-center space-x-4">
          <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
            {cardData.profilePhoto ? (
              cardData.profilePhoto.startsWith('data:video/') ? (
                <video 
                  src={cardData.profilePhoto} 
                  className="w-full h-full rounded-full"
                  style={{ objectFit: 'cover' }}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                renderCroppedImage(cardData.profilePhoto, cardData.profilePhotoCrop, "w-full h-full rounded-full")
              )
            ) : (
              <span className="text-gray-400 text-3xl">👤</span>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <input
              type="file"
              id="profileUpload"
              accept="image/*,video/*"
              onChange={(e) => {
                 const file = e.target.files?.[0]
                 if (file) {
                   // Check file size (10MB limit)
                   if (file.size > 10 * 1024 * 1024) {
                     alert('File size must be less than 10MB')
                     return
                   }
                   
                   const reader = new FileReader()
                   reader.onload = (event) => {
                     const result = event.target?.result as string
                     if (result.startsWith('data:video/')) {
                       // For videos, set directly without cropping
                       setCardData(prev => ({ ...prev, profilePhoto: result, profilePhotoCrop: null }))
                     } else {
                       // For images, show crop modal
                       setTempPhoto(result)
                       setCropData({ x: 0, y: 0, scale: 1 })
                       setShowCropModal(true)
                     }
                   }
                   reader.readAsDataURL(file)
                 }
               }}
              className="hidden"
            />
            <label
              htmlFor="profileUpload"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 cursor-pointer text-center flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
              </svg>
              Add Photo or Video
            </label>
            {cardData.profilePhoto && (
              <div className="flex space-x-2">
                {!cardData.profilePhoto.startsWith('data:video/') && (
                  <button
                    onClick={() => {
                      setTempPhoto(cardData.profilePhoto)
                      setCropData(cardData.profilePhotoCrop || { x: 0, y: 0, scale: 1 })
                      setShowCropModal(true)
                    }}
                    className="text-green-600 hover:text-green-700 text-sm"
                  >
                    Edit Crop
                  </button>
                )}
                <button
                  onClick={() => setCardData(prev => ({ ...prev, profilePhoto: null, profilePhotoCrop: null }))}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Supported formats: JPG, PNG, GIF, MP4, MOV, AVI (Max 10MB)
        </p>
      </div>

      {/* Color Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">🎋 Color</h3>
        
        {/* Preset Colors */}
        <div className="flex flex-wrap gap-3 mb-6">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => setCardData(prev => ({ ...prev, color }))}
              className={`w-10 h-10 rounded-full border-4 ${
                cardData.color === color ? 'border-gray-800' : 'border-gray-300'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

      </div>

      {/* Font Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">🌿 Font</h3>
        <select
          value={cardData.font}
          onChange={(e) => setCardData(prev => ({ ...prev, font: e.target.value }))}
          className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          {fonts.map((font) => (
            <option key={font.id} value={font.name}>{font.name}</option>
          ))}
        </select>
      </div>

      {/* Logo */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">🎋 Logo</h3>
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
            {cardData.logo ? (
              <img src={cardData.logo} alt="Logo" className="w-full h-full rounded-lg object-cover" />
            ) : (
              <span className="text-gray-400 text-xl">🏢</span>
            )}
          </div>
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
              id="logo-upload"
            />
            <label
              htmlFor="logo-upload"
              className="text-green-600 hover:text-green-700 font-medium cursor-pointer"
            >
              🌿 {cardData.logo ? 'Change Logo' : 'Add Logo'}
            </label>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">🌿 Badges</h3>
        <div className="space-y-4">
          {/* Existing Badges */}
          {cardData.badges.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {cardData.badges.map((badge, index) => (
                <div key={index} className="relative group">
                  <div className="w-16 h-16 bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
                    <img 
                      src={badge} 
                      alt={`Badge ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setCardData(prev => ({
                        ...prev,
                        badges: prev.badges.filter((_, i) => i !== index)
                      }))
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {/* Add Badge Button */}
          <div className="flex items-center space-x-4">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || [])
                files.forEach(file => {
                  const reader = new FileReader()
                  reader.onload = (event) => {
                    const result = event.target?.result as string
                    setCardData(prev => ({
                      ...prev,
                      badges: [...prev.badges, result]
                    }))
                  }
                  reader.readAsDataURL(file)
                })
                e.target.value = ''
              }}
              className="hidden"
              id="badge-upload"
            />
            <label
              htmlFor="badge-upload"
              className="cursor-pointer flex items-center space-x-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span className="text-green-600 hover:text-green-700 font-medium">Add Badge</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )

  const renderInformationTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-6">🎋 Personal</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Prefix</label>
            <input
              type="text"
              value={cardData.prefix}
              onChange={(e) => setCardData(prev => ({ ...prev, prefix: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Dr., Mr., Ms., etc."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
            <input
              type="text"
              value={cardData.firstName}
              onChange={(e) => setCardData(prev => ({ ...prev, firstName: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Middle Name</label>
            <input
              type="text"
              value={cardData.middleName}
              onChange={(e) => setCardData(prev => ({ ...prev, middleName: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
            <input
              type="text"
              value={cardData.lastName}
              onChange={(e) => setCardData(prev => ({ ...prev, lastName: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Suffix</label>
            <input
              type="text"
              value={cardData.suffix}
              onChange={(e) => setCardData(prev => ({ ...prev, suffix: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Jr., Sr., III, etc."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Accreditations</label>
            <input
              type="text"
              value={cardData.accreditations}
              onChange={(e) => setCardData(prev => ({ ...prev, accreditations: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="PhD, MD, CPA, etc."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Name</label>
            <input
              type="text"
              value={cardData.preferredName}
              onChange={(e) => setCardData(prev => ({ ...prev, preferredName: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Maiden Name</label>
            <input
              type="text"
              value={cardData.maidenName}
              onChange={(e) => setCardData(prev => ({ ...prev, maidenName: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Pronouns</label>
            <input
              type="text"
              value={cardData.pronouns}
              onChange={(e) => setCardData(prev => ({ ...prev, pronouns: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="he/him, she/her, they/them, etc."
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-6">🌿 Affiliation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={cardData.title}
              onChange={(e) => setCardData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Software Engineer, Marketing Manager, etc."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <input
              type="text"
              value={cardData.department}
              onChange={(e) => setCardData(prev => ({ ...prev, department: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
            <input
              type="text"
              value={cardData.company}
              onChange={(e) => setCardData(prev => ({ ...prev, company: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Headline</label>
            <textarea
              value={cardData.headline}
              onChange={(e) => setCardData(prev => ({ ...prev, headline: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={3}
              placeholder="Brief description or tagline"
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderFieldsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">🎋 Fields</h3>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="🔍 Search"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Selected Fields */}
      {cardData.fields.length > 0 && (
        <div className="bg-green-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-800 mb-3">🌿 Selected Fields</h4>
          <div className="space-y-6">
            {cardData.fields.map((field, index) => (
              <div key={field.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex flex-col space-y-1">
                      <button
                        onClick={() => index > 0 && moveField(index, index - 1)}
                        disabled={index === 0}
                        className="text-gray-400 hover:text-gray-600 disabled:opacity-30 text-xs"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => index < cardData.fields.length - 1 && moveField(index, index + 1)}
                        disabled={index === cardData.fields.length - 1}
                        className="text-gray-400 hover:text-gray-600 disabled:opacity-30 text-xs"
                      >
                        ▼
                      </button>
                    </div>
                    <h5 className="font-medium text-gray-800">{field.name}</h5>
                  </div>
                  <button
                    onClick={() => removeField(field.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Icon Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                        {field.icon ? (
                          <img src={field.icon} alt="Field icon" className="w-8 h-8 object-contain" />
                        ) : (
                          <span className="text-gray-400">🔗</span>
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleIconUpload(field.id, file)
                          }}
                          className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                        />
                        {field.icon && (
                          <button
                            onClick={() => updateFieldValue(field.id, 'icon', '')}
                            className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                          >
                            Remove Icon
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Background Color */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={field.backgroundColor || '#f9fafb'}
                        onChange={(e) => updateFieldValue(field.id, 'backgroundColor', e.target.value)}
                        className="w-10 h-10 border border-gray-300 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={field.backgroundColor || '#f9fafb'}
                        onChange={(e) => updateFieldValue(field.id, 'backgroundColor', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                        placeholder="#f9fafb"
                      />
                    </div>
                  </div>
                  
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      value={field.title || ''}
                      onChange={(e) => updateFieldValue(field.id, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter field title"
                    />
                  </div>
                  
                  {/* Media Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                    <select
                      value={field.mediaType || 'text'}
                      onChange={(e) => updateFieldValue(field.id, 'mediaType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="text">Text</option>
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                  </div>
                  
                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={field.description || ''}
                      onChange={(e) => updateFieldValue(field.id, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter field description"
                      rows={2}
                    />
                  </div>
                  
                  {/* Media Upload */}
                  {(field.mediaType === 'image' || field.mediaType === 'video') && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {field.mediaType === 'image' ? 'Upload Image' : 'Upload Video'}
                      </label>
                      <div className="flex items-center space-x-3">
                        {field.mediaUrl && (
                          <div className="w-20 h-20 border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                            {field.mediaType === 'image' ? (
                              <img src={field.mediaUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                              <video src={field.mediaUrl} className="w-full h-full object-cover" />
                            )}
                          </div>
                        )}
                        <input
                          type="file"
                          accept={field.mediaType === 'image' ? 'image/*' : 'video/*'}
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleMediaUpload(field.id, file, field.mediaType as 'image' | 'video')
                          }}
                          className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Value */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Value</label>
                    <input
                      type="text"
                      value={field.value || ''}
                      onChange={(e) => updateFieldValue(field.id, 'value', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder={`Enter your ${field.name.toLowerCase()}`}
                    />
                  </div>
                  
                  {/* Link */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Link (Optional)</label>
                    <input
                      type="url"
                      value={field.link || ''}
                      onChange={(e) => updateFieldValue(field.id, 'link', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Fields */}
      <div className="space-y-6">
        {Object.entries(fieldCategories).map(([category, fields]) => (
          <div key={category}>
            <h4 className="font-medium text-gray-800 mb-3">🎋 {category}</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {fields.map((field) => (
                <button
                  key={field.id}
                  onClick={() => addField(field.id, field.name)}
                  disabled={!!cardData.fields.find(f => f.id === field.id)}
                  className={`flex flex-col items-center p-3 rounded-lg border transition-colors ${
                    cardData.fields.find(f => f.id === field.id)
                      ? 'bg-green-100 border-green-300 text-green-700 cursor-not-allowed'
                      : 'bg-white border-gray-300 hover:border-green-500 hover:bg-green-50'
                  }`}
                >
                  <span className="text-2xl mb-1">{field.icon}</span>
                  <span className="text-xs text-center">{field.name}</span>
                  {cardData.fields.find(f => f.id === field.id) && (
                    <span className="text-xs text-green-600 mt-1">✓ Added</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderCardTab = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-blue-600 text-sm mb-4">ℹ️ This field does not appear on the card.</div>
      </div>
      
      <div>
        <label className="block text-lg font-semibold text-gray-800 mb-4">🎋 Name</label>
        <input
          type="text"
          value={cardData.cardName}
          onChange={(e) => setCardData(prev => ({ ...prev, cardName: e.target.value }))}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
          placeholder="Enter card name"
        />
      </div>

      <div>
        <label className="block text-lg font-semibold text-gray-800 mb-4">🎋 Card Slug</label>
        <div className="space-y-2">
          <div className={`flex items-center bg-gray-50 border rounded-lg px-4 py-3 ${
            slugError ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}>
            <span className="text-gray-600 text-lg">domain.com/hi/</span>
            <input
              type="text"
              value={cardData.slug}
              onChange={(e) => {
                const slug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/--+/g, '-')
                setCardData(prev => ({ ...prev, slug }))
                // Clear slug error when user starts typing
                if (slugError) {
                  setSlugError(null)
                  setLastError(null)
                }
              }}
              className="flex-1 bg-transparent border-none outline-none text-lg text-gray-800 placeholder-gray-400"
              placeholder="your-card-slug"
            />
          </div>
          {slugError && (
            <p className="text-sm text-red-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {slugError}
            </p>
          )}
          <p className="text-sm text-gray-500">This will be your card's public URL. Only lowercase letters, numbers, and hyphens are allowed.</p>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch(activeTab) {
      case 'display':
        return renderDisplayTab()
      case 'information':
        return renderInformationTab()
      case 'fields':
        return renderFieldsTab()
      case 'card':
        return renderCardTab()
      default:
        return renderDisplayTab()
    }
  }

  const generateUniqueSlug = async (baseSlug: string, attempt = 0): Promise<string> => {
    const slug = attempt === 0 ? baseSlug : `${baseSlug}-${attempt}`
    
    try {
      const response = await fetch(`/api/vcards?slug=${encodeURIComponent(slug)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (response.status === 404) {
        // Slug is available
        return slug
      } else if (response.ok) {
        // Slug exists, try next number
        return generateUniqueSlug(baseSlug, attempt + 1)
      } else {
        // Other error, use original slug
        return slug
      }
    } catch (error) {
      // Network error, use original slug
      return slug
    }
  }

  const handleSave = async () => {
    const startTime = Date.now()
    setLastError(null)
    setIsSaving(true)
    
    try {
      if (debugMode) {
        console.log('🐛 DEBUG: Starting card save process...')
        console.log('🐛 DEBUG: Current card data:', cardData)
        console.log('🐛 DEBUG: User object:', user)
        console.log('🐛 DEBUG: User ID:', user?.id)
        console.log('🐛 DEBUG: Is user loaded:', isLoaded)
      }
      
      // Check if user is authenticated
      if (!user || !user.id) {
        const error = 'User not authenticated. Please sign in again.'
        setLastError(error)
        alert(error)
        router.push('/sign-in')
        return
      }
      
      // Validate required fields
      if (!cardData.cardName.trim()) {
        const error = 'Please enter a card name'
        setLastError(error)
        alert(error);
        return;
      }
      
      // Auto-generate slug if empty
      let finalSlug = cardData.slug.trim()
      if (!finalSlug) {
        const baseName = cardData.cardName.trim() || `${cardData.firstName} ${cardData.lastName}`.trim() || 'my-card'
        finalSlug = baseName.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/--+/g, '-').replace(/^-+|-+$/g, '')
      }
      
      // Check if slug is already in use (only for new cards or if slug changed)
      const isEditingCard = !!editCardId
      const originalSlug = cardData.slug // This is the original slug from loaded data
      const slugChanged = isEditingCard && finalSlug !== originalSlug
      
      if (!isEditingCard || slugChanged) {
        if (debugMode) {
          console.log('🐛 DEBUG: Checking slug availability for:', finalSlug)
        }
        
        try {
          const slugCheckResponse = await fetch(`/api/vcards?slug=${encodeURIComponent(finalSlug)}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          })
          
          if (slugCheckResponse.ok) {
            // Slug already exists
            const error = `The slug "${finalSlug}" is already in use. Please choose a different one.`
            setSlugError(error)
            setLastError(error)
            alert(error)
            return
          }
        } catch (error) {
          console.error('Error checking slug availability:', error)
          // Continue with save if slug check fails
        }
      }
      
      // Clear any previous slug errors
      setSlugError(null)
      
      if (debugMode) {
        console.log('🐛 DEBUG: Slug is available:', finalSlug)
      }
      
      // Transform the card data to match the backend DTO
      const vcardData = {
        slug: finalSlug,
        templateId: cardData.design,
        title: cardData.cardName || 'My Card',
        name: `${cardData.firstName} ${cardData.lastName}`.trim() || 'Unnamed',
        jobTitle: cardData.title,
        company: cardData.company,
        bio: cardData.headline,
        avatar: cardData.profilePhoto,
        banner: cardData.logo,
        phone: cardData.fields.find(f => f.name === 'phone')?.value,
        email: cardData.fields.find(f => f.name === 'email')?.value,
        website: cardData.fields.find(f => f.name === 'website')?.value,
        address: cardData.fields.find(f => f.name === 'address')?.value,
        themeConfig: {
          color: cardData.color,
          font: cardData.font,
          design: cardData.design
        },
        publishStatus: 'PUBLISHED' as const,
        socialLinks: cardData.fields
          .filter(f => ['linkedin', 'twitter', 'instagram', 'facebook'].includes(f.name))
          .map((field, index) => ({
            platform: field.name,
            url: field.value || '',
            order: index
          }))
          .filter(link => link.url),
      };

      // Determine if we're creating or updating
      const isEditing = !!editCardId
      const apiUrl = isEditing ? `/api/vcards/${editCardId}` : '/api/vcards'
      const method = isEditing ? 'PATCH' : 'POST'

      if (debugMode) {
        console.log('🐛 DEBUG: Transformed vCard data:', vcardData)
        console.log('🐛 DEBUG: Request URL:', apiUrl)
        console.log('🐛 DEBUG: Request method:', method)
        console.log('🐛 DEBUG: Request headers:', { 'Content-Type': 'application/json' })
        console.log('🐛 DEBUG: Request body:', JSON.stringify(vcardData, null, 2))
      }

      const response = await fetch(apiUrl, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vcardData),
      });

      const responseTime = Date.now() - startTime
      
      if (debugMode) {
        console.log('🐛 DEBUG: Response received in', responseTime, 'ms')
        console.log('🐛 DEBUG: Response status:', response.status)
        console.log('🐛 DEBUG: Response headers:', Object.fromEntries(response.headers.entries()))
      }

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || `HTTP ${response.status}: Failed to save card`
        
        if (debugMode) {
          console.log('🐛 DEBUG: Error response body:', errorData)
          setDebugInfo({
            timestamp: new Date().toISOString(),
            requestData: vcardData,
            responseStatus: response.status,
            responseHeaders: Object.fromEntries(response.headers.entries()),
            errorData: errorData,
            responseTime: responseTime
          })
        }
        
        setLastError(errorMessage)
        throw new Error(errorMessage);
      }

      const savedCard = await response.json();
      
      if (debugMode) {
        console.log('🐛 DEBUG: Card saved successfully in', responseTime, 'ms')
        console.log('🐛 DEBUG: Saved card data:', savedCard)
        setDebugInfo({
          timestamp: new Date().toISOString(),
          requestData: vcardData,
          responseStatus: response.status,
          responseHeaders: Object.fromEntries(response.headers.entries()),
          savedCard: savedCard,
          responseTime: responseTime,
          success: true
        })
      }
      
      console.log('Card saved successfully:', savedCard);
      
      setIsSaving(false)
      // Redirect to dashboard with success message
      router.push('/dashboard?success=card-created');
    } catch (error) {
      const responseTime = Date.now() - startTime
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      
      if (debugMode) {
        console.log('🐛 DEBUG: Error caught after', responseTime, 'ms')
        console.log('🐛 DEBUG: Error details:', error)
        setDebugInfo((prev: any) => ({
           ...prev,
           timestamp: new Date().toISOString(),
           error: errorMessage,
           errorStack: error instanceof Error ? error.stack : undefined,
           responseTime: responseTime,
           success: false
         }))
      }
      
      setLastError(errorMessage)
      setIsSaving(false)
      console.error('Error saving card:', error);
      alert(`Failed to save card: ${errorMessage}`);
    }
  }

  const handleCropSave = () => {
    setCardData(prev => ({
      ...prev,
      profilePhoto: tempPhoto,
      profilePhotoCrop: cropData
    }))
    setShowCropModal(false)
    setTempPhoto(null)
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (5MB limit for logos)
      if (file.size > 5 * 1024 * 1024) {
        alert('Logo file size must be less than 5MB')
        return
      }
      
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        setCardData(prev => ({ ...prev, logo: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - cropData.x, y: e.clientY - cropData.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    setCropData(prev => ({
      ...prev,
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    }))
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleZoom = (delta: number) => {
    setCropData(prev => ({
      ...prev,
      scale: Math.max(0.5, Math.min(3, prev.scale + delta))
    }))
  }

  const renderCroppedImage = (imageUrl: string, crop: { x: number; y: number; scale: number } | null, className: string) => {
    if (!crop) {
      return <img src={imageUrl} alt="Profile" className={className} style={{ objectFit: 'cover', objectPosition: 'top center' }} />
    }
    
    return (
      <div className={`${className} overflow-hidden relative`}>
        <img 
          src={imageUrl} 
          alt="Profile" 
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            transform: `translate(${crop.x}px, ${crop.y}px) scale(${crop.scale})`,
            transformOrigin: 'top center',
            objectPosition: 'top center'
          }}
        />
      </div>
    )
  }

  return (
    <DashboardLayout currentPage="new-card">
      <div className="bg-gradient-to-br from-green-50 to-emerald-100 min-h-full">
        <style dangerouslySetInnerHTML={{ __html: customStyles }} />
        {/* Action Bar */}
        <div className="bg-white shadow-sm border-b border-green-100 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-gray-800">Create New Card</h2>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setDebugMode(!debugMode)}
                className={`px-4 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 ${
                  debugMode 
                    ? 'bg-orange-100 text-orange-700 border border-orange-300' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="Toggle debug mode for detailed logging"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 8h-2.81c-.45-.78-1.07-1.45-1.82-1.96L17 4.41 15.59 3l-2.17 2.17C12.96 5.06 12.49 5 12 5s-.96.06-1.42.17L8.41 3 7 4.41l1.62 1.63C7.88 6.55 7.26 7.22 6.81 8H4v2h2.09c-.05.33-.09.66-.09 1v1H4v2h2v1c0 .34.04.67.09 1H4v2h2.81c1.04 1.79 2.97 3 5.19 3s4.15-1.21 5.19-3H20v-2h-2.09c.05-.33.09-.66.09-1v-1h2v-2h-2v-1c0-.34-.04-.67-.09-1H20V8zm-6 8h-4v-2h4v2zm0-4h-4v-2h4v2z"/>
                </svg>
                {debugMode ? 'Debug ON' : 'Debug'}
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className="px-6 py-2.5 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-2.5 rounded-xl hover:from-green-700 hover:to-emerald-700 font-semibold flex items-center gap-2 shadow-lg transition-all transform hover:scale-105 ${
                  isSaving ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
                    </svg>
                    Save
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

      <div className="max-w-7xl mx-auto flex gap-6 p-6">
        {/* Card Preview */}
        <div className="w-80 bg-white rounded-2xl shadow-xl border border-green-100 p-6">
          <div className="bg-white shadow-lg relative overflow-hidden rounded-2xl">
            {/* Profile Photo Section with Design Shape */}
            <div className={`relative h-56 overflow-hidden ${
              designs.find(d => d.id === cardData.design)?.headStyle === 'curved-bottom' ? 'rounded-t-2xl rounded-b-3xl' :
              designs.find(d => d.id === cardData.design)?.headStyle === 'flat-top' ? 'rounded-2xl' :
              designs.find(d => d.id === cardData.design)?.headStyle === 'diagonal-cut' ? 'rounded-t-2xl clip-diagonal' :
              designs.find(d => d.id === cardData.design)?.headStyle === 'wave-bottom' ? 'rounded-t-2xl wave-shape' :
              designs.find(d => d.id === cardData.design)?.headStyle === 'blend-bottom' ? 'rounded-t-2xl blend-shape' :
              designs.find(d => d.id === cardData.design)?.headStyle === 'curvy-bottom' ? 'rounded-t-2xl curvy-shape' :
              designs.find(d => d.id === cardData.design)?.headStyle === 'triangle-cut' ? 'rounded-t-2xl triangle-shape' :
              designs.find(d => d.id === cardData.design)?.headStyle === 'organic-curve' ? 'rounded-t-2xl organic-shape' :
              designs.find(d => d.id === cardData.design)?.headStyle === 'clean-line' ? 'rounded-2xl' :
              designs.find(d => d.id === cardData.design)?.headStyle === 'zigzag-bottom' ? 'rounded-t-2xl zigzag-shape' :
              designs.find(d => d.id === cardData.design)?.headStyle === 'arch-bottom' ? 'rounded-t-2xl arch-shape' :
              designs.find(d => d.id === cardData.design)?.headStyle === 'split-diagonal' ? 'rounded-t-2xl split-shape' :
              designs.find(d => d.id === cardData.design)?.headStyle === 'bubble-cut' ? 'rounded-t-2xl bubble-shape' :
              designs.find(d => d.id === cardData.design)?.headStyle === 'stepped-bottom' ? 'rounded-t-2xl stepped-shape' :
              'rounded-t-2xl splash-shape'
            }`}>
              {/* Color Background */}
              <div 
                className="absolute inset-0"
                style={{ backgroundColor: cardData.color || '#8B5CF6' }}
              ></div>
              
              {/* Bottom Curve Design Element */}
              <div className={`absolute bottom-0 left-0 right-0 h-8 ${
                designs.find(d => d.id === cardData.design)?.headStyle === 'curved-bottom' ? 'rounded-b-3xl' :
                designs.find(d => d.id === cardData.design)?.headStyle === 'flat-top' ? '' :
                designs.find(d => d.id === cardData.design)?.headStyle === 'diagonal-cut' ? 'clip-diagonal' :
                designs.find(d => d.id === cardData.design)?.headStyle === 'wave-bottom' ? 'wave-shape' :
                designs.find(d => d.id === cardData.design)?.headStyle === 'blend-bottom' ? 'blend-shape' :
                designs.find(d => d.id === cardData.design)?.headStyle === 'curvy-bottom' ? 'curvy-shape' :
                designs.find(d => d.id === cardData.design)?.headStyle === 'triangle-cut' ? 'triangle-shape' :
                designs.find(d => d.id === cardData.design)?.headStyle === 'organic-curve' ? 'organic-shape' :
                designs.find(d => d.id === cardData.design)?.headStyle === 'clean-line' ? '' :
                designs.find(d => d.id === cardData.design)?.headStyle === 'zigzag-bottom' ? 'zigzag-shape' :
                designs.find(d => d.id === cardData.design)?.headStyle === 'arch-bottom' ? 'arch-shape' :
                designs.find(d => d.id === cardData.design)?.headStyle === 'split-diagonal' ? 'split-shape' :
                designs.find(d => d.id === cardData.design)?.headStyle === 'bubble-cut' ? 'bubble-shape' :
                designs.find(d => d.id === cardData.design)?.headStyle === 'stepped-bottom' ? 'stepped-shape' :
                'splash-shape'
              }`} style={{ backgroundColor: cardData.color || '#8B5CF6', opacity: 0.8 }}></div>
              
              {/* Logo */}
              {cardData.logo && (
                <div className="absolute top-4 left-4 z-10">
                  <img 
                    src={cardData.logo} 
                    alt="Company Logo" 
                    className="w-12 h-12 object-contain bg-white bg-opacity-80 rounded-lg p-1"
                  />
                </div>
              )}
              
              {/* Profile Photo */}
              <div className="absolute inset-0 overflow-hidden">
                {cardData.profilePhoto ? (
                  cardData.profilePhoto.startsWith('data:video/') ? (
                    <video 
                      src={cardData.profilePhoto} 
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    renderCroppedImage(cardData.profilePhoto, cardData.profilePhotoCrop, "w-full h-full object-cover")
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-16 h-16 text-white opacity-50" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                )}
              </div>
            </div>
             
             {/* Information Section - Professional Layout */}
             <div className="px-6 py-5 bg-white">
              <div className="text-left">
                {/* Full Name with Prefix and Suffix */}
                {[cardData.prefix, cardData.firstName, cardData.middleName, cardData.lastName, cardData.suffix]
                  .filter(Boolean).length > 0 && (
                  <h3 className="text-2xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: cardData.font }}>
                    {[cardData.prefix, cardData.firstName, cardData.middleName, cardData.lastName, cardData.suffix]
                      .filter(Boolean)
                      .join(' ')}
                  </h3>
                )}
                
                {/* Preferred Name */}
                {cardData.preferredName && (
                  <p className="text-sm text-gray-600 mt-1" style={{ fontFamily: cardData.font }}>
                    Goes by {cardData.preferredName}
                  </p>
                )}
                
                {/* Pronouns */}
                {cardData.pronouns && (
                  <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: cardData.font }}>
                    ({cardData.pronouns})
                  </p>
                )}
                
                {/* Title */}
                {cardData.title && (
                  <p className="text-base text-gray-700 mt-2 font-medium" style={{ fontFamily: cardData.font }}>
                    {cardData.title}
                  </p>
                )}
                
                {/* Department */}
                {cardData.department && (
                  <div className="text-sm text-gray-600 mt-1" style={{ fontFamily: cardData.font }}>
                    {cardData.department}
                  </div>
                )}
                
                {/* Company */}
                {cardData.company && (
                  <div className="text-base text-gray-800 mt-1 font-semibold" style={{ fontFamily: cardData.font }}>
                    {cardData.company}
                  </div>
                )}
                
                {/* Accreditations */}
                {cardData.accreditations && (
                  <p className="text-sm text-gray-600 mt-1" style={{ fontFamily: cardData.font }}>
                    {cardData.accreditations}
                  </p>
                )}
                
                {/* Headline */}
                {cardData.headline && (
                  <p className="text-sm text-gray-700 mt-3 italic" style={{ fontFamily: cardData.font }}>
                    {cardData.headline}
                  </p>
                )}
                
                {/* Maiden Name */}
                 {cardData.maidenName && (
                   <p className="text-xs text-gray-500 mt-2" style={{ fontFamily: cardData.font }}>
                     Maiden name: {cardData.maidenName}
                   </p>
                 )}
                 
                 {/* Badges Section */}
                 {cardData.badges && cardData.badges.length > 0 && (
                   <div className="mt-4">
                     <div className="flex flex-wrap gap-2">
                       {cardData.badges.map((badge, index) => (
                         <div key={index} className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 bg-white">
                           <img 
                             src={badge} 
                             alt={`Badge ${index + 1}`}
                             className="w-full h-full object-contain"
                           />
                         </div>
                       ))}
                     </div>
                   </div>
                 )}
                 
                 {/* Fields Section */}
                 {cardData.fields && cardData.fields.length > 0 && (
                   <div className="mt-4 space-y-3">
                     {cardData.fields.map((field, index) => {
                       // Only show fields that have at least a title, value, or media
                       if (!field.title && !field.value && !field.mediaUrl) return null;
                       
                       return (
                         <div 
                           key={index} 
                           className="flex items-start space-x-3 p-3 rounded-lg"
                           style={{ backgroundColor: field.backgroundColor || '#f9fafb' }}
                         >
                           {/* Icon */}
                           <div className="flex-shrink-0">
                             {field.icon ? (
                               <img 
                                 src={field.icon} 
                                 alt="Field icon"
                                 className="w-6 h-6 object-contain"
                               />
                             ) : (
                               <div className="w-6 h-6 bg-gray-300 rounded flex items-center justify-center text-xs text-gray-600">
                                 {field.mediaType === 'image' ? '🖼️' : field.mediaType === 'video' ? '🎥' : '🔗'}
                               </div>
                             )}
                           </div>
                           
                           {/* Content */}
                           <div className="flex-1 min-w-0">
                             {/* Title */}
                             {field.title && (
                               <h4 className="text-sm font-medium text-gray-800 mb-1" style={{ fontFamily: cardData.font }}>
                                 {field.title}
                               </h4>
                             )}
                             
                             {/* Description */}
                             {field.description && (
                               <p className="text-xs text-gray-600 mb-2" style={{ fontFamily: cardData.font }}>
                                 {field.description}
                               </p>
                             )}
                             
                             {/* Media Content */}
                             {field.mediaUrl && (
                               <div className="mb-2">
                                 {field.mediaType === 'image' ? (
                                   <img 
                                     src={field.mediaUrl} 
                                     alt={field.title || 'Field image'}
                                     className="max-w-full h-auto rounded-lg max-h-32 object-cover"
                                   />
                                 ) : field.mediaType === 'video' ? (
                                   <video 
                                     src={field.mediaUrl}
                                     controls
                                     className="max-w-full h-auto rounded-lg max-h-32"
                                   >
                                     Your browser does not support the video tag.
                                   </video>
                                 ) : null}
                               </div>
                             )}
                             
                             {/* Link/Value */}
                             {field.link ? (
                               <a 
                                 href={field.link}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="text-sm text-blue-600 hover:text-blue-800 underline"
                                 style={{ fontFamily: cardData.font }}
                               >
                                 {field.value || field.link}
                               </a>
                             ) : field.value && (
                               <span className="text-sm text-gray-700" style={{ fontFamily: cardData.font }}>
                                 {field.value}
                               </span>
                             )}
                           </div>
                         </div>
                       );
                     })}
                   </div>
                 )}
               </div>
               
               {/* Bottom section with QR code */}
               <div className="flex items-center justify-end mt-6 pt-4 border-t border-gray-100">
                <div className="w-10 h-10 bg-gray-900 rounded flex items-center justify-center">
                  <div className="grid grid-cols-3 gap-px">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className={`w-1 h-1 ${Math.random() > 0.5 ? 'bg-white' : 'bg-transparent'}`}></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Tabs */}
          <div className="bg-white rounded-t-2xl border-b border-green-100 shadow-sm">
            <div className="flex space-x-2 px-6 pt-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                  }`}
                >
                  <span className={activeTab === tab.id ? 'text-white' : ''}>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
            <div className="h-4"></div>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-b-2xl shadow-sm p-8">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Debug Panel */}
      {debugMode && (
        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 8h-2.81c-.45-.78-1.07-1.45-1.82-1.96L17 4.41 15.59 3l-2.17 2.17C12.96 5.06 12.49 5 12 5s-.96.06-1.42.17L8.41 3 7 4.41l1.62 1.63C7.88 6.55 7.26 7.22 6.81 8H4v2h2.09c-.05.33-.09.66-.09 1v1H4v2h2v1c0 .34.04.67.09 1H4v2h2.81c1.04 1.79 2.97 3 5.19 3s4.15-1.21 5.19-3H20v-2h-2.09c.05-.33.09-.66.09-1v-1h2v-2h-2v-1c0-.34-.04-.67-.09-1H20V8zm-6 8h-4v-2h4v2zm0-4h-4v-2h4v2z"/>
              </svg>
              <h3 className="text-lg font-semibold text-orange-800">Debug Information</h3>
              <button
                onClick={() => {
                  setDebugInfo(null)
                  setLastError(null)
                }}
                className="ml-auto px-3 py-1 text-sm bg-orange-200 text-orange-700 rounded-lg hover:bg-orange-300 transition-colors"
              >
                Clear
              </button>
            </div>
            
            {lastError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">Last Error:</h4>
                <p className="text-red-700 text-sm font-mono">{lastError}</p>
              </div>
            )}
            
            {debugInfo && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white border border-orange-200 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-2">Request Info:</h4>
                    <div className="text-sm space-y-1">
                      <p><span className="font-medium">Timestamp:</span> {debugInfo.timestamp}</p>
                      <p><span className="font-medium">Response Time:</span> {debugInfo.responseTime}ms</p>
                      <p><span className="font-medium">Status:</span> 
                        <span className={`ml-1 px-2 py-1 rounded text-xs ${
                          debugInfo.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {debugInfo.success ? 'Success' : 'Failed'}
                        </span>
                      </p>
                      {debugInfo.responseStatus && (
                        <p><span className="font-medium">HTTP Status:</span> {debugInfo.responseStatus}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-white border border-orange-200 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-2">Response Headers:</h4>
                    <pre className="text-xs text-gray-600 overflow-auto max-h-32">
                      {JSON.stringify(debugInfo.responseHeaders, null, 2)}
                    </pre>
                  </div>
                </div>
                
                <div className="p-4 bg-white border border-orange-200 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-2">Request Data:</h4>
                  <pre className="text-xs text-gray-600 overflow-auto max-h-48 bg-gray-50 p-3 rounded">
                    {JSON.stringify(debugInfo.requestData, null, 2)}
                  </pre>
                </div>
                
                {debugInfo.savedCard && (
                  <div className="p-4 bg-white border border-orange-200 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-2">Saved Card Response:</h4>
                    <pre className="text-xs text-gray-600 overflow-auto max-h-48 bg-gray-50 p-3 rounded">
                      {JSON.stringify(debugInfo.savedCard, null, 2)}
                    </pre>
                  </div>
                )}
                
                {debugInfo.errorData && (
                  <div className="p-4 bg-white border border-red-200 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2">Error Response:</h4>
                    <pre className="text-xs text-red-600 overflow-auto max-h-48 bg-red-50 p-3 rounded">
                      {JSON.stringify(debugInfo.errorData, null, 2)}
                    </pre>
                  </div>
                )}
                
                {debugInfo.error && (
                  <div className="p-4 bg-white border border-red-200 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2">Error Details:</h4>
                    <p className="text-sm text-red-700 mb-2">{debugInfo.error}</p>
                    {debugInfo.errorStack && (
                      <pre className="text-xs text-red-600 overflow-auto max-h-32 bg-red-50 p-3 rounded">
                        {debugInfo.errorStack}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {!debugInfo && !lastError && (
              <div className="text-center py-8 text-orange-600">
                <p>Debug mode is active. Try saving a card to see detailed information here.</p>
                <p className="text-sm mt-2">Check the browser console for real-time debug logs.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Crop Modal */}
      {showCropModal && tempPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add Photo Or Video</h3>
              <button
                onClick={() => {
                  setShowCropModal(false)
                  setTempPhoto(null)
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-4">
              <div 
                className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden relative cursor-move flex items-center justify-center"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <img 
                  src={tempPhoto} 
                  alt="Crop preview" 
                  className="max-w-none h-auto"
                  style={{
                    transform: `translate(${cropData.x}px, ${cropData.y}px) scale(${cropData.scale})`,
                    transformOrigin: 'center',
                    minHeight: '100%',
                    minWidth: '100%'
                  }}
                  draggable={false}
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Zoom</label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleZoom(-0.1)}
                  className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                >
                  −
                </button>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={cropData.scale}
                  onChange={(e) => setCropData(prev => ({ ...prev, scale: parseFloat(e.target.value) }))}
                  className="flex-1"
                />
                <button
                  onClick={() => handleZoom(0.1)}
                  className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowCropModal(false)
                  setTempPhoto(null)
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCropSave}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Add Media
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </DashboardLayout>
  )
}