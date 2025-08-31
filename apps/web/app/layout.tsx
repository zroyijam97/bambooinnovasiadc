import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { QueryProvider } from '@/components/query-provider';
import { ClerkProviderWrapper } from '@/components/providers/clerk-provider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BambooInnovasia Digital Cards',
  description: 'Modern digital business card platform for professionals and businesses',
  keywords: 'digital business card, vcard, networking, professional, contact sharing',
  authors: [{ name: 'BambooInnovasia' }],
  creator: 'BambooInnovasia',
  publisher: 'BambooInnovasia',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'BambooInnovasia Digital Cards',
    description: 'Modern digital business card platform for professionals and businesses',
    url: '/',
    siteName: 'BambooInnovasia Digital Cards',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BambooInnovasia Digital Cards',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BambooInnovasia Digital Cards',
    description: 'Modern digital business card platform for professionals and businesses',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background font-sans antialiased`}>
        <ClerkProviderWrapper>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <QueryProvider>
              {children}
              <Toaster />
            </QueryProvider>
          </ThemeProvider>
        </ClerkProviderWrapper>
      </body>
    </html>
  );
}