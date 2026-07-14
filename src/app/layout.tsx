
import type {
  Metadata,
  Viewport,
} from "next";

import localFont from "next/font/local";
import Script from "next/script";
import NextTopLoader from "nextjs-toploader";

import "./globals.css";

import { Toaster } from "@/components/ui/sonner";
import ServiceWorkerCleanup from "@/components/ServiceWorkerCleanup";

import { QueryProvider } from "./query-provider";
import { AuthProvider } from "@/context/AuthContext";

const GTM_ID = "GTM-TM76Z944";

const poppins = localFont({
  variable: "--font-poppins",
  display: "swap",

  src: [
    {
      path: "./fonts/poppins-300.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/poppins-400.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/poppins-500.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/poppins-600.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/poppins-700.ttf",
      weight: "700",
      style: "normal",
    },
  ],
});



export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,

  themeColor: [
    {
      media:
        "(prefers-color-scheme: light)",
      color: "#cd935b",
    },
    {
      media:
        "(prefers-color-scheme: dark)",
      color: "#ffcc02",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${poppins.variable} font-sans antialiased`}
      >
        {/*
         * Supprime les anciens service workers
         * et caches PWA installés dans le navigateur.
         *
         * Ce composant peut être retiré plus tard,
         * après quelques déploiements.
         */}
        <ServiceWorkerCleanup />

        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
        >
          {`
            (function(w,d,s,l,i){
              w[l]=w[l]||[];
              w[l].push({
                'gtm.start': new Date().getTime(),
                event: 'gtm.js'
              });

              var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),
              dl=l!='dataLayer'
                ? '&l='+l
                : '';

              j.async=true;
              j.src=
                'https://www.googletagmanager.com/gtm.js?id='
                + i + dl;

              f.parentNode.insertBefore(j,f);
            })(
              window,
              document,
              'script',
              'dataLayer',
              '${GTM_ID}'
            );
          `}
        </Script>

        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            title="Google Tag Manager"
            style={{
              display: "none",
              visibility: "hidden",
            }}
          />
        </noscript>

        <QueryProvider>
          <AuthProvider>
            <NextTopLoader
              color="#ffffff"
              initialPosition={0.08}
              crawlSpeed={200}
              height={3}
              crawl
              showSpinner={false}
              easing="ease"
              speed={200}
              shadow="0 0 10px #ffffff, 0 0 5px #ffffff"
              template={`
                <div
                  class="bar"
                  role="bar"
                >
                  <div class="peg"></div>
                </div>

                <div
                  class="spinner"
                  role="spinner"
                >
                  <div
                    class="spinner-icon"
                  ></div>
                </div>
              `}
              zIndex={1600}
              showAtBottom={false}
            />

            {children}

            <Toaster />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
