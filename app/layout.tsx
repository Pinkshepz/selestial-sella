import React from "react"
import type { Metadata } from "next"

import "./styles/globals.css"
import "./styles/brand.css"
import "./styles/fontface.css"
import "./styles/controller.css"
import "./styles/two-columns.css"
import "./styles/quiz-interface.css"
import "./styles/slider.css"

import "./utility/firebase/fireclient-alpha"

import GlobalNavigator from "./components/navigator"
import Loading from "./utility/components/loading"
import ThemeProvider from "./global-provider"
import { GlobalProvider } from "./global-provider";

export const metadata: Metadata = {
  title: "AURICLE",
  description: "",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <GlobalProvider>
        <html lang="en" suppressHydrationWarning>
          <body className="relative">
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem >
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
