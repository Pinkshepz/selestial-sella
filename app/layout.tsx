import React from 'react'
import type { Metadata } from 'next'

import './styles/globals.css'
import './styles/fontface.css'

import "./libs/firebase/fireclient"

import GlobalNavigator from './component/navigator'
import ThemeProvider from './provider'
import { GlobalProvider } from "./provider";

export const metadata: Metadata = {
  title: 'Selestial Stella',
  description: 'End-to-end SI academic resource for practicing and recalling',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <GlobalProvider>
        <html lang="en" suppressHydrationWarning>
          <body>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem >
              {children}
              <GlobalNavigator />
            </ThemeProvider>
          </body>
        </html>
    </GlobalProvider>
  );
}
