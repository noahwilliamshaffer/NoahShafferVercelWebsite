import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/toaster'
import { SiteHeader } from '@/components/site-header'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Professional Resume | Noah Shaffer',
  description: 'Cybersecurity professional with expertise in Risk Management Framework (RMF), STIG compliance, and secure system implementation',
  keywords: ['noah shaffer', 'resume', 'cybersecurity', 'rmf', 'stig', 'disa', 'security engineer'],
  authors: [{ name: 'Noah Shaffer' }],
  creator: 'Noah Shaffer',
  publisher: 'Noah Shaffer',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:3000'
  ),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Professional Resume | Noah Shaffer',
    description: 'Cybersecurity professional with expertise in Risk Management Framework (RMF), STIG compliance, and secure system implementation',
    siteName: 'Noah Shaffer - Professional Resume',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Professional Resume | Noah Shaffer',
    description: 'Cybersecurity professional with expertise in Risk Management Framework (RMF), STIG compliance, and secure system implementation',
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative min-h-screen">
            <SiteHeader />
            {children}
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

