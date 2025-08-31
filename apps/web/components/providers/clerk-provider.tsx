'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { ReactNode } from 'react'

interface ClerkProviderWrapperProps {
  children: ReactNode
}

export function ClerkProviderWrapper({ children }: ClerkProviderWrapperProps) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: '#16a34a', // green-600 to match bamboo theme
          colorBackground: '#ffffff',
          colorText: '#1f2937',
          colorTextSecondary: '#6b7280',
          colorInputBackground: '#f9fafb',
          colorInputText: '#1f2937',
          borderRadius: '0.5rem',
        },
        elements: {
          formButtonPrimary: {
            backgroundColor: '#16a34a',
            '&:hover': {
              backgroundColor: '#15803d',
            },
          },
          card: {
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          },
        },
      }}
    >
      {children}
    </ClerkProvider>
  )
}