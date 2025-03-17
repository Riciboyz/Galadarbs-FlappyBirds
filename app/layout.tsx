import type { Metadata } from 'next'
import { Inter, Poppins } from "next/font/google"
import "./globals.css"
import UserDataLoader from '@/components/user-data-loader'
import { ThemeProvider } from '@/components/theme-provider'

// Load fonts
const poppins = Poppins({ 
  weight: ['400', '500', '600', '700', '800'],
  subsets: ["latin"],
  variable: '--font-poppins',
})

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Flappy Bird Game',
  description: 'A fun Flappy Bird game with user accounts and leaderboards',
  generator: 'v0.dev',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={`${poppins.variable} ${inter.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <UserDataLoader />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
