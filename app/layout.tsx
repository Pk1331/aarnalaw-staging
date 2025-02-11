
import { ThemeModeScript } from "flowbite-react";
import "./globals.css";
import Header from "../components/Header/NavBar";
import Footer from "../components/Footer/Footer";
import Script from "next/script";




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" sizes="any" />
        <ThemeModeScript />
        <meta name="msvalidate.01" content="A827D56A91561DA21E2E94273F4D52D5" />
      </head>

      <body>
        <Header />
        {children}
        <Footer />
        
        
        {/* Schema */}
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Aarna Law - Advocates & Consultants",
              url: "https://aarnalaw.com/",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://aarnalaw.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
          strategy="afterInteractive"
        />

        {/* GTM Noscript */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WJW9WNHQ"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>

        {/* Tracking Scripts */}
        <Script src="/tracking.js" strategy="afterInteractive" />
        <Script
          src="https://cdn.jsdelivr.net/npm/flowbite@2.5.2/dist/flowbite.min.js"
          strategy="afterInteractive"
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-YWL8EWE9MB"
          strategy="afterInteractive"
          async
        />
      </body>
    </html>
  );
}
