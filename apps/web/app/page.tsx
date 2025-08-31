'use client'

import { useUser, UserButton } from '@clerk/nextjs'
import Link from 'next/link'

export default function HomePage() {
  const { user, isLoaded } = useUser()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Navigation */}
      <nav className="border-b border-green-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L8 6v12l4-4 4 4V6l-4-4z"/>
                </svg>
              </div>
              <div className="text-2xl font-bold text-green-800">
                BambooInnovasia
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isLoaded && user ? (
                <>
                  <Link href="/dashboard" className="text-green-600 hover:text-green-800 px-3 py-2 text-sm font-medium transition-colors">
                    Dashboard
                  </Link>
                  <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: "w-8 h-8"
                      }
                    }}
                  />
                </>
              ) : (
                <>
                  <Link href="/sign-in" className="text-green-600 hover:text-green-800 px-3 py-2 text-sm font-medium transition-colors">
                    Log In
                  </Link>
                  <Link href="/sign-up" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Create a Free Card
                  </Link>
                  <button className="border border-green-300 hover:border-green-400 text-green-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Schedule a Demo
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Bamboo Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="bamboo" x="0" y="0" width="20" height="100" patternUnits="userSpaceOnUse">
                <rect x="8" y="0" width="4" height="100" fill="currentColor" className="text-green-600"/>
                <circle cx="10" cy="20" r="1" fill="currentColor" className="text-green-600"/>
                <circle cx="10" cy="40" r="1" fill="currentColor" className="text-green-600"/>
                <circle cx="10" cy="60" r="1" fill="currentColor" className="text-green-600"/>
                <circle cx="10" cy="80" r="1" fill="currentColor" className="text-green-600"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#bamboo)"/>
          </svg>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32">
          <div className="mb-8">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
              🎋 Sustainable • Digital • Eco-Friendly
            </span>
          </div>
          
          <h1 className="mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight text-green-900 sm:text-7xl">
            Grow Your Network,{' '}
            <span className="relative whitespace-nowrap text-green-600">
              <svg
                aria-hidden="true"
                viewBox="0 0 418 42"
                className="absolute top-2/3 left-0 h-[0.58em] w-full fill-green-300"
                preserveAspectRatio="none"
              >
                <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
              </svg>
              <span className="relative">Sustainably</span>
            </span>{' '}
            Like Bamboo
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-green-700">
            Just like bamboo grows rapidly and sustainably, BambooInnovasia helps your professional network flourish. Our digital business cards eliminate paper waste while creating meaningful connections that grow your business naturally.
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span className="text-sm font-medium">100% Paperless</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012-2v-1a2 2 0 012-2h1.945M12 7c0-1.657-1.343-3-3-3s-3 1.343-3 3c0 .199.02.393.057.581 1.474.541 2.927-.882 2.927-2.581z"/>
              </svg>
              <span className="text-sm font-medium">Eco-Friendly</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
              </svg>
              <span className="text-sm font-medium">Professional Growth</span>
            </div>
          </div>
          
          <div className="mt-10 flex justify-center gap-x-6">
            <button className="group inline-flex items-center justify-center rounded-full py-3 px-6 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-green-600 text-white hover:bg-green-700 active:bg-green-800 focus-visible:outline-green-600 shadow-lg">
              🌱 Start Growing Your Network
            </button>
            <button className="group inline-flex ring-1 items-center justify-center rounded-full py-3 px-6 text-sm focus:outline-none ring-green-300 text-green-700 hover:text-green-800 hover:ring-green-400 active:bg-green-50 active:text-green-800 focus-visible:outline-green-600 focus-visible:ring-green-300">
              📊 See Our Impact
            </button>
          </div>
        </div>
      </div>
      
      {/* Environmental Impact Stats Section */}
      <div className="bg-green-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Growing Sustainably, Connecting Globally
            </h2>
            <p className="text-lg text-green-100 mb-12">
              Like bamboo, our impact grows rapidly while nurturing the environment
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-300">1000+</div>
              <div className="text-sm text-green-100">digital cards created</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-300">35%</div>
              <div className="text-sm text-green-100">more CO₂ absorbed vs trees</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-300">5</div>
              <div className="text-sm text-green-100">planting locations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-300">12</div>
              <div className="text-sm text-green-100">tons CO₂/year per hectare</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-300">100%</div>
              <div className="text-sm text-green-100">sustainable growth</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-300">0</div>
              <div className="text-sm text-green-100">paper cards needed</div>
            </div>
          </div>
          
          {/* Environmental Benefits */}
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Carbon Sequestration</h3>
              <p className="text-green-100">Each bamboo plant absorbs up to 12 tons of CO₂ per hectare annually, contributing significantly to carbon reduction.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM8 15v-3a1 1 0 011-1h2a1 1 0 011 1v3H8z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Soil Conservation</h3>
              <p className="text-green-100">Bamboo's extensive root system prevents soil erosion and helps maintain water table levels.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Biodiversity</h3>
              <p className="text-green-100">Our bamboo forests create habitats for various species and contribute to local ecosystem health.</p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-green-900 mb-4">
              Grow Your Network Like Bamboo
            </h2>
            <p className="text-lg text-green-700 max-w-3xl mx-auto">
              Just as bamboo grows rapidly and connects through underground networks, BambooInnovasia helps you build meaningful professional connections that flourish naturally.
            </p>
          </div>
          
          {/* Growth Process */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">Plant Your Seed</h3>
              <p className="text-green-600 text-sm">Create your digital business card with sustainable design</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎋</span>
              </div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">Share & Connect</h3>
              <p className="text-green-600 text-sm">Share your card anywhere to build genuine connections</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">Track Growth</h3>
              <p className="text-green-600 text-sm">Monitor your network's growth with real-time analytics</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌿</span>
              </div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">Flourish Together</h3>
              <p className="text-green-600 text-sm">Scale your impact across your entire team</p>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-green-700 max-w-4xl mx-auto leading-relaxed">
              Like bamboo's interconnected root system, BambooInnovasia creates a network that strengthens with every connection. Your digital business card becomes the seed that grows into meaningful professional relationships, all while contributing to a more sustainable future.
            </p>
          </div>
        </div>
      </div>

      {/* Plans Section */}
      <div className="py-16 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-green-900 mb-4">
              Choose Your Growth Plan
            </h2>
            <p className="text-lg text-green-700 max-w-3xl mx-auto">
              Like bamboo varieties, each plan is designed to thrive in different environments. Start your sustainable networking journey today.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Enterprise Plan */}
            <div className="bg-white border border-green-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow relative">
              <div className="absolute top-0 right-0 bg-green-600 text-white px-3 py-1 rounded-bl-lg rounded-tr-lg text-xs font-semibold">
                🌿 Most Popular
              </div>
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🎋</span>
                </div>
                <h3 className="text-xl font-semibold text-green-900 mb-2">Enterprise Forest</h3>
                <div className="text-3xl font-bold text-green-800 mb-1">$99</div>
                <div className="text-sm text-green-600">per month</div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-sm text-green-700">
                  <span className="w-4 h-4 bg-green-500 rounded-full mr-3 flex-shrink-0"></span>
                  Unlimited digital cards
                </li>
                <li className="flex items-center text-sm text-green-700">
                  <span className="w-4 h-4 bg-green-500 rounded-full mr-3 flex-shrink-0"></span>
                  Advanced growth analytics
                </li>
                <li className="flex items-center text-sm text-green-700">
                  <span className="w-4 h-4 bg-green-500 rounded-full mr-3 flex-shrink-0"></span>
                  Team ecosystem management
                </li>
                <li className="flex items-center text-sm text-green-700">
                  <span className="w-4 h-4 bg-green-500 rounded-full mr-3 flex-shrink-0"></span>
                  Priority cultivation support
                </li>
              </ul>
              <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors">
                Start Growing
              </button>
            </div>
            
            {/* Business Plan */}
            <div className="bg-white border border-green-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🌿</span>
                </div>
                <h3 className="text-xl font-semibold text-green-900 mb-2">Business Grove</h3>
                <div className="text-3xl font-bold text-green-800 mb-1">$49</div>
                <div className="text-sm text-green-600">per month</div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-sm text-green-700">
                  <span className="w-4 h-4 bg-green-500 rounded-full mr-3 flex-shrink-0"></span>
                  50 digital cards
                </li>
                <li className="flex items-center text-sm text-green-700">
                  <span className="w-4 h-4 bg-green-500 rounded-full mr-3 flex-shrink-0"></span>
                  Growth analytics
                </li>
                <li className="flex items-center text-sm text-green-700">
                  <span className="w-4 h-4 bg-green-500 rounded-full mr-3 flex-shrink-0"></span>
                  CRM root integration
                </li>
                <li className="flex items-center text-sm text-green-700">
                  <span className="w-4 h-4 bg-green-500 rounded-full mr-3 flex-shrink-0"></span>
                  Email cultivation support
                </li>
              </ul>
              <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors">
                Start Growing
              </button>
            </div>
            
            {/* Professional Plan */}
            <div className="bg-white border border-green-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🌱</span>
                </div>
                <h3 className="text-xl font-semibold text-green-900 mb-2">Professional Shoot</h3>
                <div className="text-3xl font-bold text-green-800 mb-1">$19</div>
                <div className="text-sm text-green-600">per month</div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-sm text-green-700">
                  <span className="w-4 h-4 bg-green-500 rounded-full mr-3 flex-shrink-0"></span>
                  10 digital cards
                </li>
                <li className="flex items-center text-sm text-green-700">
                  <span className="w-4 h-4 bg-green-500 rounded-full mr-3 flex-shrink-0"></span>
                  Basic growth tracking
                </li>
                <li className="flex items-center text-sm text-green-700">
                  <span className="w-4 h-4 bg-green-500 rounded-full mr-3 flex-shrink-0"></span>
                  Custom bamboo branding
                </li>
                <li className="flex items-center text-sm text-green-700">
                  <span className="w-4 h-4 bg-green-500 rounded-full mr-3 flex-shrink-0"></span>
                  Standard support
                </li>
              </ul>
              <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors">
                Start Growing
              </button>
            </div>
            
            {/* Personal Plan */}
            <div className="bg-white border border-green-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🌾</span>
                </div>
                <h3 className="text-xl font-semibold text-green-900 mb-2">Personal Seed</h3>
                <div className="text-3xl font-bold text-green-800 mb-1">Free</div>
                <div className="text-sm text-green-600">forever</div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-sm text-green-700">
                  <span className="w-4 h-4 bg-green-500 rounded-full mr-3 flex-shrink-0"></span>
                  1 digital card
                </li>
                <li className="flex items-center text-sm text-green-700">
                  <span className="w-4 h-4 bg-green-500 rounded-full mr-3 flex-shrink-0"></span>
                  Essential features
                </li>
                <li className="flex items-center text-sm text-green-700">
                  <span className="w-4 h-4 bg-green-500 rounded-full mr-3 flex-shrink-0"></span>
                  Community garden support
                </li>
                <li className="flex items-center text-sm text-green-700">
                  <span className="w-4 h-4 bg-green-500 rounded-full mr-3 flex-shrink-0"></span>
                  Mobile app access
                </li>
              </ul>
              <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors">
                Plant Your Seed
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-green-900 mb-4">
              What Makes BambooInnovasia Sustainable?
            </h2>
            <p className="text-lg text-green-700 max-w-3xl mx-auto">
              Like bamboo's remarkable properties, we're building a networking platform that's fast-growing, resilient, and environmentally conscious.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-green-900 mb-4">Rapid Growth</h3>
              <p className="text-green-700">
                Like bamboo's record-breaking growth speed, share your information instantly with a simple tap or scan. No more paper waste or manual typing.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-green-900 mb-4">Growth Analytics</h3>
              <p className="text-green-700">
                Track your network's growth like monitoring bamboo forests. See engagement patterns and nurture the most valuable professional relationships.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-green-900 mb-4">Naturally Secure</h3>
              <p className="text-green-700">
                Protected like bamboo's natural antimicrobial properties. Your data is encrypted and secure, with full control over your information sharing.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-green-900 mb-4">Self-Regenerating</h3>
              <p className="text-green-700">
                Like bamboo's ability to regenerate, your information updates automatically across all connections. Change once, update everywhere.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-green-900 mb-4">Global Ecosystem</h3>
              <p className="text-green-700">
                Connect across continents like bamboo's worldwide presence. Break language barriers and cultural boundaries with sustainable networking.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-green-900 mb-4">Team Forest</h3>
              <p className="text-green-700">
                Manage your team like a bamboo grove - interconnected, supportive, and growing together. Unified branding with sustainable impact.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}