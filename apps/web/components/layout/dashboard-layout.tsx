'use client'

import { useUser, UserButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useState, ReactNode } from 'react'

interface DashboardLayoutProps {
  children: ReactNode
  currentPage?: string
}

export default function DashboardLayout({ children, currentPage = 'dashboard' }: DashboardLayoutProps) {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [activeMenu, setActiveMenu] = useState(currentPage)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const menuItems = [
    { 
      id: 'cards', 
      label: 'Cards', 
      href: '/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
        </svg>
      )
    },
    { 
      id: 'new-card', 
      label: 'New Card', 
      href: '/new-card',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
      )
    },
    { 
      id: 'contacts', 
      label: 'Contacts', 
      href: '/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
      )
    },
    { 
      id: 'backgrounds', 
      label: 'Backgrounds', 
      href: '/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      )
    },
    { 
      id: 'signatures', 
      label: 'Email Signatures', 
      href: '/dashboard',
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
      href: '/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
        </svg>
      )
    },
    { 
      id: 'crm', 
      label: 'CRM', 
      href: '/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
        </svg>
      )
    },
    { 
      id: 'business', 
      label: 'Business Tools', 
      href: '/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
        </svg>
      )
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      href: '/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      )
    },
    { 
      id: 'support', 
      label: 'Support', 
      href: '/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-1.106-1.106A6.003 6.003 0 004 10c0 .639.1 1.254.287 1.831l1.555-1.555zm3.493-1.442A4.001 4.001 0 0110 8c.226 0 .445.018.662.05l1.555-1.555A5.973 5.973 0 0010 6c-.639 0-1.254.1-1.831.287L9.65 7.768z" clipRule="evenodd" />
        </svg>
      )
    },
    { 
      id: 'help', 
      label: 'Help Center', 
      href: '/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.061-1.061C8.735 4.017 9.61 3.75 10.25 3.75s1.515.267 2.371 1.129c.87.876 1.129 1.996 1.129 2.621 0 .76-.316 1.467-.905 1.96a2.471 2.471 0 00-.539.617c-.133.221-.195.479-.195.748v.008A.75.75 0 0111.25 11h-1.5a.75.75 0 01-.75-.75v-.008c0-.537.2-1.055.602-1.432.221-.207.324-.4.324-.568 0-.235-.14-.526-.395-.787C9.201 7.116 8.956 7 8.75 7s-.451.116-.781.455a.75.75 0 11-1.061-1.061C7.735 5.517 8.61 5.25 9.25 5.25s1.515.267 2.371 1.129c.87.876 1.129 1.996 1.129 2.621 0 .76-.316 1.467-.905 1.96a2.471 2.471 0 00-.539.617c-.133.221-.195.479-.195.748v.008A.75.75 0 0110.25 13h-1.5a.75.75 0 01-.75-.75v-.008c0-.537.2-1.055.602-1.432.221-.207.324-.4.324-.568 0-.235-.14-.526-.395-.787C8.201 9.116 7.956 9 7.75 9s-.451.116-.781.455zM10 15a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      )
    }
  ]

  const handleMenuClick = (item: typeof menuItems[0]) => {
    if (item.href) {
      router.push(item.href)
    }
    setActiveMenu(item.id)
    setShowMobileMenu(false)
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex justify-between items-center">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 rounded-lg bg-green-600 text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-800">
            {menuItems.find(item => item.id === currentPage)?.label || 'Dashboard'}
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
      <div className={`${showMobileMenu ? 'block' : 'hidden'} lg:block w-full lg:w-64 bg-gradient-to-b from-green-600 to-green-800 text-white lg:min-h-screen`}>
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
              {menuItems.filter(item => ['cards', 'new-card', 'contacts', 'backgrounds', 'signatures', 'analytics', 'crm', 'business'].includes(item.id)).map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item)}
                  className={`w-full flex items-center space-x-3 px-3 py-3 lg:py-2 rounded-lg text-left transition-colors ${
                    currentPage === item.id 
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
                  onClick={() => handleMenuClick(item)}
                  className={`w-full flex items-center space-x-3 px-3 py-3 lg:py-2 rounded-lg text-left transition-colors ${
                    currentPage === item.id 
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
              {menuItems.find(item => item.id === currentPage)?.label || 'Dashboard'}
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
          {children}
        </main>
      </div>
    </div>
  )
}