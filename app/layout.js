import { IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google'
import { AuthProvider } from '@/lib/hooks/useAuth'
import './globals.css'

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-ui',
  display: 'swap',
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-content',
  display: 'swap',
})

export const metadata = {
  title: { default: 'NAWER', template: '%s | NAWER' },
  description: "Générateur d'exercices pédagogiques aligné programme MEN Tunisie",
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${ibmPlexSans.variable} ${ibmPlexMono.variable}`}>
      <body className="font-ui bg-bg-primary text-nawer-text-primary">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
