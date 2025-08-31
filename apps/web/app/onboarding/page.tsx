'use client'

import { useUser } from '@clerk/nextjs'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/layout/dashboard-layout'

type Plan = {
  id: string
  name: string
  price: number
  period: string
  features: string[]
  icon: string
  popular?: boolean
}

const plans: Plan[] = [
  {
    id: 'personal',
    name: 'Personal Seed',
    price: 0,
    period: 'forever',
    icon: '🌾',
    features: [
      '1 digital card',
      'Essential features',
      'Community garden support',
      'Mobile app access'
    ]
  },
  {
    id: 'professional',
    name: 'Professional Shoot',
    price: 19,
    period: 'month',
    icon: '🌱',
    features: [
      '10 digital cards',
      'Basic growth tracking',
      'Custom bamboo branding',
      'Standard support'
    ]
  },
  {
    id: 'business',
    name: 'Business Grove',
    price: 49,
    period: 'month',
    icon: '🌿',
    popular: true,
    features: [
      '50 digital cards',
      'Growth analytics',
      'CRM root integration',
      'Email cultivation support'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise Forest',
    price: 99,
    period: 'month',
    icon: '🎋',
    features: [
      'Unlimited digital cards',
      'Advanced growth analytics',
      'Team ecosystem management',
      'Priority cultivation support'
    ]
  }
]

export default function OnboardingPage() {
  const { user } = useUser()
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState<string>('personal')
  const [isLoading, setIsLoading] = useState(false)

  const handlePlanSelection = async (planId: string) => {
    setIsLoading(true)
    setSelectedPlan(planId)
    
    try {
      // Here you would typically:
      // 1. Create a subscription in your backend
      // 2. If it's a paid plan, redirect to payment
      // 3. If it's free, just update user metadata
      
      if (planId === 'personal') {
        // Free plan - just update user metadata and redirect
        await user?.update({
          unsafeMetadata: {
            plan: planId,
            subscriptionStatus: 'active'
          }
        })
        router.push('/dashboard')
      } else {
        // Paid plan - redirect to payment (you'd integrate with Stripe here)
        router.push(`/payment?plan=${planId}`)
      }
    } catch (error) {
      console.error('Error selecting plan:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout currentPage="onboarding">
      <div className="bg-green-50 py-12 min-h-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-green-900 mb-4">
            Welcome to BambooInnovasia, {user?.firstName}! 🌱
          </h1>
          <p className="text-xl text-green-700 max-w-3xl mx-auto">
            Choose your growth plan to start building your sustainable professional network
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-all cursor-pointer relative ${
                selectedPlan === plan.id
                  ? 'border-green-500 ring-2 ring-green-200'
                  : 'border-green-200'
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-green-600 text-white px-3 py-1 rounded-bl-lg rounded-tr-lg text-xs font-semibold">
                  🌿 Most Popular
                </div>
              )}
              
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">{plan.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-green-900 mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold text-green-800 mb-1">
                  {plan.price === 0 ? 'Free' : `$${plan.price}`}
                </div>
                <div className="text-sm text-green-600">per {plan.period}</div>
              </div>
              
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-green-700">
                    <span className="w-4 h-4 bg-green-500 rounded-full mr-3 flex-shrink-0"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => handlePlanSelection(selectedPlan)}
            disabled={isLoading}
            className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Setting up your garden...' : 
             selectedPlan === 'personal' ? 'Start with Free Plan' : 
             `Continue with ${plans.find(p => p.id === selectedPlan)?.name}`}
          </button>
          
          <p className="text-sm text-green-600 mt-4">
            You can always upgrade or change your plan later
          </p>
        </div>
        </div>
      </div>
    </DashboardLayout>
  )
}