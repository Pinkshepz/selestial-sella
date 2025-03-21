import React from 'react'
import type { Metadata } from 'next'

import './styles/globals.css'
import './styles/brand.css'
import './styles/fontface.css'
import './styles/controller.css'
import './styles/two-columns.css'
import './styles/quiz-interface.css'
import './styles/slider.css'

import "./libs/firebase/fireclient"

import GlobalNavigator from './components/navigator'
import Loading from './libs/material/loading'
import ThemeProvider from './global-provider'
import { GlobalProvider } from "./global-provider";

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
              <Loading />
            </ThemeProvider>
          </body>
        </html>
    </GlobalProvider>
  );
}

// Disable static rendering
export const dynamic = "force-dynamic";
