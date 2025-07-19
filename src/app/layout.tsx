import type React from "react"

import type { Metadata } from "next"
import Head from "next/head"
import Script from "next/script"

import { Inter } from "next/font/google"

import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from '@vercel/analytics/react'

import ClientProviders from "./client-provider"

import PageLoader from "@/components/animations/loader"

import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Casa de Carnes Duarte",
  description: "A arte de oferecer qualidade.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <Head>
        <title>Casa de Carnes Duarte</title>

        <meta name="description" content="A arte de oferecer qualidade." />
        <meta name="keywords" content="carnes, açougue, salto, churrasco, premium, duarte" />
        <meta name="author" content="Casa de Carnes Duarte" />
        <meta name="robots" content="index, follow" />

        {/* Google / Search Engine */}
        <meta itemProp="name" content="Casa de Carnes Duarte" />
        <meta itemProp="description" content="A arte de oferecer qualidade." />
        <meta itemProp="image" content="https://butchers-website.vercel.app/logo-casa-de-carnes.jpg" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://butchers-website.vercel.app/" />
        <meta property="og:title" content="Casa de Carnes Duarte" />
        <meta property="og:description" content="A arte de oferecer qualidade." />
        <meta property="og:image" content="https://butchers-website.vercel.app/logo/logo.jpg" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://butchers-website.vercel.app/" />
        <meta name="twitter:title" content="Casa de Carnes Duarte" />
        <meta name="twitter:description" content="As melhores carnes de Salto. Entrega rápida e qualidade premium!" />
        <meta name="twitter:image" content="https://butchers-website.vercel.app/logo/logo.jpg" />

        <link rel="icon" href="/favicon.ico" />

          


      </Head>
      <body className={inter.className}>
        <Script id="gtm-script" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;
            j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
            f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-P58KHRK9');`}
          </Script>

        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-P58KHRK9"
            height="0" width="0" style={{ display: "none", visibility: "hidden" }}>
          </iframe>
        </noscript>

        <ClientProviders>
            <PageLoader message="A arte de oferecer qualidade">{children}</PageLoader>
        </ClientProviders>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
