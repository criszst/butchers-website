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

           <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white mt-16">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4 text-orange-400">Casa de Carne Duarte</h3>
                <p className="text-gray-300 mb-4">
                  Há mais de 35 anos oferecendo os melhores cortes de carne com qualidade premium e atendimento
                  excepcional.
                </p>
                <div className="flex space-x-4">
                  <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors cursor-pointer">
                    <span className="text-sm font-bold">f</span>
                  </div>
                  <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors cursor-pointer">
                    <span className="text-sm font-bold">@</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4 text-orange-400">Contato</h4>
                <div className="space-y-2 text-gray-300">
                  <p>📍 Rua das Carnes, 123 - Centro</p>
                  <p>📞 (11) 9999-9999</p>
                  <p>✉️ contato@carneduarte.com.br</p>
                  <p>🕒 Seg-Sáb: 7h às 19h</p>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4 text-orange-400">Categorias</h4>
                <div className="space-y-2 text-gray-300">
                  <p className="hover:text-orange-400 cursor-pointer transition-colors">Carnes Bovinas</p>
                  <p className="hover:text-orange-400 cursor-pointer transition-colors">Carnes Suínas</p>
                  <p className="hover:text-orange-400 cursor-pointer transition-colors">Aves</p>
                  <p className="hover:text-orange-400 cursor-pointer transition-colors">Linguiças</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 Casa de Carne Duarte. Todos os direitos reservados.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
