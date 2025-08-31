'use client'

import { useUser, UserButton } from '@clerk/nextjs'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'

interface VCard {
  id: string
  slug: string
  title: string
  name: string
  jobTitle?: string
  company?: string
  bio?: string
  avatar?: string
  publishStatus: 'DRAFT' | 'PUBLISHED'
  createdAt: string
  updatedAt: string
  _count?: {
    services: number
    socialLinks: number
    testimonials: number
  }
}

export default function DashboardPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeMenu, setActiveMenu] = useState('cards')
  const [vcards, setVcards] = useState<VCard[]>([])
  const [loading, setLoading] = useState(true)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/sign-in')
    } else if (isLoaded && user) {
      fetchVCards()
      
      // Check for success parameter
      const success = searchParams.get('success')
      if (success === 'card-created') {
        setShowSuccessMessage(true)
        // Remove the success parameter from URL
        const newUrl = window.location.pathname
        window.history.replaceState({}, '', newUrl)
        // Hide success message after 5 seconds
        setTimeout(() => setShowSuccessMessage(false), 5000)
      }
    }
  }, [isLoaded, user, router, searchParams])

  const fetchVCards = async () => {
    try {
      const response = await fetch('/api/vcards')
      if (response.ok) {
        const data = await response.json()
        setVcards(data)
      }
    } catch (error) {
      console.error('Error fetching VCards:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNewCard = () => {
    router.push('/new-card')
  }

  const handleEditCard = (slug: string) => {
    router.push(`/new-card?edit=${slug}`)
  }

  const handleViewCard = (slug: string) => {
    window.open(`/hi/${slug}`, '_blank')
  }

  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading...</p>
        </div>
      </div>
    )
  }

  const menuItems = [
    { 
      id: 'cards', 
      label: 'Cards', 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
        </svg>
      )
    },
    { 
      id: 'contacts', 
      label: 'Contacts', 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
      )
    },
    { 
      id: 'backgrounds', 
      label: 'Backgrounds', 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      )
    },
    { 
      id: 'signatures', 
      label: 'Email Signatures', 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
        </svg>
      )
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
        </svg>
      )
    },
    { 
      id: 'crm', 
      label: 'CRM', 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
        </svg>
      )
    },
    { 
      id: 'business', 
      label: 'My Business', 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
        </svg>
      )
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      )
    },
    { 
      id: 'support', 
      label: 'Contact Support', 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-1.588-1.588A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.539-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z" clipRule="evenodd" />
        </svg>
      )
    },
    { 
      id: 'help', 
      label: 'Help Center', 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.061-1.061 3 3 0 112.871 5.026v.345a.75.75 0 01-1.5 0v-.5c0-.72.57-1.3 1.25-1.344A1.5 1.5 0 108.94 6.94zM10 15a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      )
    }
  ]

  const renderCardsContent = () => (
    <div className="p-4 lg:p-8">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="mb-6 mx-auto max-w-md">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800">
                Successfully created your card!
              </p>
            </div>
            <button
              onClick={() => setShowSuccessMessage(false)}
              className="flex-shrink-0 text-green-400 hover:text-green-600"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      <div className="text-center mb-6 lg:mb-12">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-light text-gray-800 mb-3">Welcome to your cards page!</h2>
        <p className="text-gray-500 mb-4 lg:mb-8 text-sm sm:text-base lg:text-lg px-4">Tap to edit and manage your cards.</p>
        <button 
          onClick={handleNewCard}
          className="bg-green-600 text-white px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 lg:py-3 rounded-full hover:bg-green-700 transition-colors font-medium text-xs sm:text-sm lg:text-base shadow-lg flex items-center justify-center space-x-2"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          <span>New Card</span>
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : vcards.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 max-w-7xl mx-auto mb-6 lg:mb-12">
          {vcards.map((vcard, index) => {
            const cardColors = [
              'from-red-500 to-red-600',
              'from-blue-500 to-blue-600', 
              'from-green-500 to-emerald-600',
              'from-purple-500 to-purple-600',
              'from-orange-500 to-orange-600',
              'from-pink-500 to-pink-600'
            ]
            const colorClass = cardColors[index % cardColors.length]
            
            return (
              <div 
                key={vcard.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group overflow-hidden border border-gray-100"
              >
                {/* Header with gradient background */}
                <div className={`bg-gradient-to-br ${colorClass} h-24 relative`}>
                  <div className="absolute inset-0 bg-black/10"></div>
                  
                  {/* Status indicator */}
                  <div className="absolute top-3 left-4">
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      vcard.publishStatus === 'PUBLISHED' 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                        vcard.publishStatus === 'PUBLISHED' ? 'bg-green-500' : 'bg-yellow-500'
                      }`}></div>
                      {vcard.publishStatus === 'PUBLISHED' ? 'Published' : 'Draft'}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="absolute top-3 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditCard(vcard.slug)
                      }}
                      className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-2 transition-colors"
                      title="Edit Card"
                    >
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleViewCard(vcard.slug)
                      }}
                      className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-2 transition-colors"
                      title="View Card"
                    >
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Profile section */}
                <div className="p-6 relative">
                  {/* Profile image */}
                  <div className="absolute -top-8 left-6">
                    {vcard.avatar ? (
                      <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white">
                        <Image
                          src={vcard.avatar}
                          alt={vcard.name || 'Profile'}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-100 border-4 border-white shadow-lg flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="mt-10">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {vcard.name || 'Unnamed Card'}
                    </h3>
                    
                    {vcard.jobTitle && (
                      <p className="text-sm text-gray-600 mb-1">{vcard.jobTitle}</p>
                    )}
                    
                    {vcard.company && (
                      <p className="text-sm text-gray-500 mb-3">{vcard.company}</p>
                    )}
                    
                    {vcard.bio && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                        {vcard.bio}
                      </p>
                    )}

                    {/* Stats */}
                    {vcard._count && (
                      <div className="flex items-center space-x-4 text-xs text-gray-500 mb-4">
                        {vcard._count.services > 0 && (
                          <span className="flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {vcard._count.services} services
                          </span>
                        )}
                        {vcard._count.socialLinks > 0 && (
                          <span className="flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            {vcard._count.socialLinks} links
                          </span>
                        )}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>Updated {new Date(vcard.updatedAt).toLocaleDateString()}</span>
                      <span className="text-gray-300">•</span>
                      <span>{vcard.title}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📇</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No cards yet</h3>
          <p className="text-gray-600 mb-6">Create your first digital business card to get started!</p>
          <button 
            onClick={handleNewCard}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Create Your First Card
          </button>
        </div>
      )}
      
      {vcards.length > 0 && (
        <div className="text-center">
          <button 
            onClick={handleNewCard}
            className="text-green-600 hover:text-green-700 font-medium text-sm sm:text-base lg:text-lg flex items-center justify-center space-x-2"
          >
             <span>🎋</span>
             <span>Create a new card from scratch</span>
           </button>
        </div>
      )}
    </div>
  )

  const renderContactsContent = () => (
    <div className="p-4 lg:p-8">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 lg:mb-8 space-y-4 lg:space-y-0">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 lg:space-x-6">
          <input 
            type="text" 
            placeholder="Search Contacts" 
            className="border border-gray-300 rounded-lg px-4 py-3 w-full sm:w-64 lg:w-80 text-sm"
          />
          <div className="flex items-center space-x-4">
            <span className="text-gray-500 text-sm">1</span>
            <button className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center space-x-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
              </svg>
              <span>Filters</span>
            </button>
          </div>
        </div>
        <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium text-sm lg:text-base w-full sm:w-auto shadow-lg flex items-center justify-center space-x-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
          </svg>
          <span>New Contact</span>
        </button>
      </div>
      
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="hidden lg:grid lg:grid-cols-6 gap-6 p-6 border-b bg-gray-50 text-xs font-semibold text-gray-600 uppercase tracking-wide">
          <div>NAME</div>
          <div>TITLE</div>
          <div>COMPANY</div>
          <div>TAGS</div>
          <div>ASSOCIATED CARD</div>
          <div>DATE ADDED</div>
        </div>
        
        <div className="lg:grid lg:grid-cols-6 lg:gap-6 p-4 lg:p-6 border-b lg:items-center">
          <div className="flex items-center space-x-3 mb-3 lg:mb-0">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
            <span className="font-medium text-gray-900">Marc Benioff</span>
          </div>
          <div className="mb-2 lg:mb-0">
            <span className="text-xs text-gray-500 uppercase tracking-wide lg:hidden">Title: </span>
            <span className="text-gray-600 text-sm">Co-founder & CEO</span>
          </div>
          <div className="mb-2 lg:mb-0">
            <span className="text-xs text-gray-500 uppercase tracking-wide lg:hidden">Company: </span>
            <span className="text-gray-600 text-sm">HiHello, Inc.</span>
          </div>
          <div className="mb-2 lg:mb-0">
            <span className="text-xs text-gray-500 uppercase tracking-wide lg:hidden">Tags: </span>
            <span className="text-gray-400 text-sm">—</span>
          </div>
          <div className="mb-2 lg:mb-0">
            <span className="text-xs text-gray-500 uppercase tracking-wide lg:hidden">Associated Card: </span>
            <span className="text-gray-400 text-sm">—</span>
          </div>
          <div>
            <span className="text-xs text-gray-500 uppercase tracking-wide lg:hidden">Date Added: </span>
            <span className="text-gray-600 text-sm">May 17, 2020</span>
          </div>
        </div>
      </div>
      
      <div className="text-center mt-16">
        <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-3">Add another contact!</h3>
        <p className="text-gray-500 text-base leading-relaxed">
          You won't have any new contacts unless you connect with<br/>
          HiHello. Try clicking one of your cards,<br/>
          scanning a paper card, or adding one now!
        </p>
      </div>
    </div>
  )

  const renderBackgroundsContent = () => (
    <div className="p-4 lg:p-8">
      <div className="flex flex-wrap items-center gap-3 lg:gap-4 mb-6 lg:mb-8">
         <div className="bg-green-600 rounded-lg px-4 lg:px-6 py-2 lg:py-3 text-white text-center shadow-md">
           <span className="text-xs lg:text-sm font-medium flex items-center space-x-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h2zm4-3a1 1 0 00-1 1v1h2V4a1 1 0 00-1-1H10z" clipRule="evenodd" />
                </svg>
                <span>Work</span>
              </span>
         </div>
         <div className="bg-emerald-500 rounded-lg px-4 lg:px-6 py-2 lg:py-3 text-white text-center shadow-md">
           <span className="text-xs lg:text-sm font-medium flex items-center space-x-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span>Personal</span>
              </span>
         </div>
       </div>
      
      <div className="bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl p-6 lg:p-8 mb-8 lg:mb-12 relative max-w-lg shadow-lg border border-green-300/30">
        <div className="text-white">
          <h3 className="text-lg lg:text-xl font-semibold mb-2">{user.firstName} {user.lastName}</h3>
          <p className="text-xs lg:text-sm opacity-90">BambooInnovasia</p>
        </div>
        <div className="absolute bottom-4 lg:bottom-6 right-4 lg:right-6">
          <div className="w-16 lg:w-20 h-16 lg:h-20 bg-white rounded-lg border-2 border-gray-200 flex items-center justify-center">
            <div className="w-12 lg:w-16 h-12 lg:h-16 bg-gray-800 rounded flex items-center justify-center">
              <div className="grid grid-cols-3 gap-1">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className={`w-1 h-1 ${Math.random() > 0.5 ? 'bg-white' : 'bg-transparent'}`}></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-8 lg:mb-12">
        <h3 className="text-lg lg:text-xl font-semibold text-gray-800 mb-4 lg:mb-6">Use Your Own</h3>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 lg:p-12 text-center max-w-md">
          <div className="w-12 lg:w-16 h-12 lg:h-16 bg-gray-100 rounded-lg mx-auto mb-4 lg:mb-6 flex items-center justify-center">
            <svg className="w-6 lg:w-8 h-6 lg:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <button className="text-green-600 hover:text-green-700 font-semibold text-xs lg:text-sm tracking-wide flex items-center justify-center space-x-2">
             <span>🎋</span>
             <span>UPLOAD IMAGE</span>
           </button>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg lg:text-xl font-semibold text-gray-800 mb-4 lg:mb-6">Featured</h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6">
          <div className="aspect-video bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl shadow-md"></div>
          <div className="aspect-video bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl shadow-md"></div>
          <div className="aspect-video bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md"></div>
          <div className="aspect-video bg-gradient-to-br from-teal-400 to-green-500 rounded-xl shadow-md"></div>
          <div className="aspect-video bg-gradient-to-br from-lime-400 to-green-500 rounded-xl shadow-md"></div>
          <div className="aspect-video bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl shadow-md"></div>
        </div>
      </div>
    </div>
  )

  const renderSignaturesContent = () => (
    <div className="p-4 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12 mb-8 lg:mb-12">
        <div>
          <h3 className="text-base lg:text-lg font-semibold text-gray-800 mb-4 lg:mb-6">Card</h3>
          <div className="space-y-3">
            <button className="bg-emerald-500 text-white px-4 lg:px-6 py-2.5 lg:py-3 rounded-lg text-sm font-medium w-full shadow-md flex items-center justify-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span>Personal</span>
            </button>
            <button className="bg-gray-100 text-gray-700 px-4 lg:px-6 py-2.5 lg:py-3 rounded-lg text-sm w-full hover:bg-gray-200">Usage</button>
          </div>
        </div>
        
        <div>
          <h3 className="text-base lg:text-lg font-semibold text-gray-800 mb-4 lg:mb-6">Style</h3>
          <div className="grid grid-cols-3 gap-2 lg:gap-3 mb-3">
            <div className="border-2 border-green-500 rounded-lg p-2 lg:p-4 text-center bg-green-50">
              <div className="text-xs lg:text-sm font-medium text-green-700 flex items-center space-x-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
              </svg>
              <span>Rich</span>
            </div>
            </div>
            <div className="border border-gray-300 rounded-lg p-2 lg:p-4 text-center hover:border-gray-400">
              <div className="text-xs lg:text-sm text-gray-700">Formal</div>
            </div>
            <div className="border border-gray-300 rounded-lg p-2 lg:p-4 text-center hover:border-gray-400">
              <div className="text-xs lg:text-sm text-gray-700">Fusion</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 lg:gap-3">
            <div className="border border-gray-300 rounded-lg p-2 lg:p-4 text-center hover:border-gray-400">
              <div className="text-xs lg:text-sm text-gray-700">Hybrid</div>
            </div>
            <div className="border border-gray-300 rounded-lg p-2 lg:p-4 text-center hover:border-gray-400">
              <div className="text-xs lg:text-sm text-gray-700">Traditional</div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-base lg:text-lg font-semibold text-gray-800 mb-4 lg:mb-6">Platform</h3>
          <div className="space-y-4">
            <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold">WILL APPLY TO</div>
            <div className="grid grid-cols-2 gap-2 lg:gap-3">
              <button className="border border-gray-300 rounded-lg px-3 lg:px-4 py-2 text-xs lg:text-sm hover:border-gray-400">Apple</button>
              <button className="border border-gray-300 rounded-lg px-3 lg:px-4 py-2 text-xs lg:text-sm hover:border-gray-400">Gmail</button>
              <button className="border border-gray-300 rounded-lg px-3 lg:px-4 py-2 text-xs lg:text-sm hover:border-gray-400">Other</button>
              <button className="border border-gray-300 rounded-lg px-3 lg:px-4 py-2 text-xs lg:text-sm hover:border-gray-400">Outlook</button>
            </div>
          </div>
          
          <div className="mt-6 lg:mt-8">
            <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium text-sm lg:text-base w-full shadow-lg">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
             <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
           </svg>
           Apply
            </button>
            <p className="text-xs lg:text-sm text-gray-500 mt-3">You must select a platform first.</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-xl p-4 lg:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="bg-red-500 rounded-xl p-4 lg:p-6 text-white text-center w-32 lg:w-40 h-20 lg:h-24 flex items-center justify-center shadow-lg flex-shrink-0">
            <div>
              <div className="text-xs lg:text-sm font-semibold">{user.firstName} {user.lastName}</div>
              <div className="text-xs opacity-90 mt-1">PERSONAL</div>
            </div>
          </div>
          <div className="bg-emerald-500 rounded-lg p-2 lg:p-3 w-16 lg:w-20 h-16 lg:h-20 flex items-center justify-center shadow-lg flex-shrink-0">
            <div className="w-10 lg:w-14 h-10 lg:h-14 bg-white rounded-lg border-2 border-gray-200 flex items-center justify-center">
              <div className="w-8 lg:w-10 h-8 lg:h-10 bg-gray-800 rounded flex items-center justify-center">
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
    </div>
  )

  const renderAnalyticsContent = () => (
    <div className="p-4 lg:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-green-200 p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base lg:text-lg font-semibold text-gray-800 flex items-center space-x-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
          <span>Total Views</span>
        </h3>
            <span className="text-xl lg:text-2xl">👁️</span>
          </div>
          <div className="text-2xl lg:text-3xl font-bold text-green-700 mb-2">1,234</div>
          <div className="text-xs lg:text-sm text-green-600">+12% from last month</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-green-200 p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base lg:text-lg font-semibold text-gray-800 flex items-center space-x-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
          </svg>
          <span>Connections</span>
        </h3>
            <span className="text-xl lg:text-2xl">🤝</span>
          </div>
          <div className="text-2xl lg:text-3xl font-bold text-green-700 mb-2">89</div>
          <div className="text-xs lg:text-sm text-green-600">+5% from last month</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-green-200 p-4 lg:p-6 md:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base lg:text-lg font-semibold text-gray-800 flex items-center space-x-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
          </svg>
          <span>Shares</span>
        </h3>
            <span className="text-xl lg:text-2xl">📤</span>
          </div>
          <div className="text-2xl lg:text-3xl font-bold text-green-700 mb-2">45</div>
          <div className="text-xs lg:text-sm text-emerald-600">-2% from last month</div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-green-200 p-4 lg:p-6">
        <h3 className="text-base lg:text-lg font-semibold text-gray-800 mb-4 lg:mb-6 flex items-center space-x-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>
          <span>Activity Overview</span>
        </h3>
        <div className="h-48 lg:h-64 bg-green-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl lg:text-4xl mb-4">🎋</div>
            <div className="text-sm lg:text-base text-green-600">Bamboo analytics chart would go here</div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderDefaultContent = () => (
    <div className="p-6 text-center">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        {menuItems.find(item => item.id === activeMenu)?.label}
      </h2>
      <p className="text-gray-600">This section is coming soon!</p>
    </div>
  )

  const renderContent = () => {
    switch(activeMenu) {
      case 'cards':
        return renderCardsContent()
      case 'contacts':
        return renderContactsContent()
      case 'backgrounds':
        return renderBackgroundsContent()
      case 'signatures':
        return renderSignaturesContent()
      case 'analytics':
        return renderAnalyticsContent()
      default:
        return renderDefaultContent()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex justify-between items-center">
          <button
            onClick={() => setActiveMenu(activeMenu === 'menu' ? 'cards' : 'menu')}
            className="p-2 rounded-lg bg-green-600 text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-800">
            {menuItems.find(item => item.id === activeMenu)?.label || 'Dashboard'}
          </h1>
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "w-8 h-8"
              }
            }}
          />
        </div>
      </header>

      {/* Sidebar */}
      <div className={`${activeMenu === 'menu' ? 'block' : 'hidden'} lg:block w-full lg:w-64 bg-gradient-to-b from-green-600 to-green-800 text-white lg:min-h-screen`}>
        <div className="p-4 h-full flex flex-col">
          <div className="hidden lg:flex items-center space-x-2 mb-8">
            <span className="text-2xl">👋</span>
            <div>
              <div className="font-semibold">Hi, {user.firstName}</div>
              <div className="text-sm text-green-200">{user.emailAddresses[0]?.emailAddress}</div>
            </div>
          </div>
          
          {/* Features Section */}
          <div className="flex-1">
            <div className="text-green-200 text-xs uppercase tracking-wide font-semibold mb-3 px-2">Features</div>
            <nav className="space-y-2 mb-8">
              {menuItems.filter(item => ['cards', 'contacts', 'backgrounds', 'signatures', 'analytics', 'crm', 'business'].includes(item.id)).map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-3 lg:py-2 rounded-lg text-left transition-colors ${
                    activeMenu === item.id 
                      ? 'bg-green-700 text-white' 
                      : 'text-green-100 hover:bg-green-700 hover:text-white'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span className="text-sm">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
          
          {/* Settings & Support Section */}
          <div>
            <div className="text-green-200 text-xs uppercase tracking-wide font-semibold mb-3 px-2">Settings & Support</div>
            <nav className="space-y-2">
              {menuItems.filter(item => ['settings', 'support', 'help'].includes(item.id)).map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-3 lg:py-2 rounded-lg text-left transition-colors ${
                    activeMenu === item.id 
                      ? 'bg-green-700 text-white' 
                      : 'text-green-100 hover:bg-green-700 hover:text-white'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span className="text-sm">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Desktop Header */}
        <header className="hidden lg:block bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800">
              {menuItems.find(item => item.id === activeMenu)?.label}
            </h1>
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8"
                }
              }}
            />
          </div>
        </header>
        
        {/* Content */}
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}