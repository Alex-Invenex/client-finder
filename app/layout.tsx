import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Client Finder - Find and Connect with Potential Clients',
  description: 'Discover businesses, analyze websites, and get contact information to grow your client base.',
  keywords: 'business finder, client acquisition, lead generation, contact finder',
  authors: [{ name: 'Client Finder' }],
  openGraph: {
    title: 'Client Finder - Find and Connect with Potential Clients',
    description: 'Discover businesses, analyze websites, and get contact information to grow your client base.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}