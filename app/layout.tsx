import { ThemeModeScript } from "flowbite-react";
import "./globals.css";
import Header from "../components/Header/NavBar";
import Footer from "../components/Footer/Footer";
import Script from "next/script";
import { headers } from 'next/headers';
import { LanguageProvider } from "../app/context/LanguageContext"; // ✅ Import LanguageProvider

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get the host from headers
  const headersList = headers();
  const host = headersList.get('host') || '';

  // Determine if this is staging environment
  const isStaging = host.includes('website.aarnalaw.com');

  return (
    <html lang="en">
      <head>
        <meta
          name="robots"
          content={isStaging ? "noindex, nofollow" : "index, follow"}
        />
        <link rel="icon" href="/favicon.png" sizes="any" />
        <ThemeModeScript />
        <meta name="msvalidate.01" content="A827D56A91561DA21E2E94273F4D52D5" />
      </head>
      <body>
        {/* ✅ Wrap the entire app with LanguageProvider */}
        <LanguageProvider>
          <Header />
          {children}
          <Footer />
        </LanguageProvider>

        {/* Schema */}
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Aarna Law - Advocates & Consultants",
              url: "https://www.aarnalaw.com/",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://www.aarnalaw.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
          strategy="afterInteractive"
        />

        {/* Performance Monitoring */}
        <Script
          id="performance-monitor"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // Monitor DOM size
              function monitorDOMSize() {
                const totalElements = document.getElementsByTagName('*').length;
                const bodyElements = document.body.getElementsByTagName('*').length;
                
                if (totalElements > 800) {
                  console.warn('High DOM size detected:', totalElements, 'elements');
                }
                
                return { totalElements, bodyElements };
              }
              
              // Monitor on page load and after dynamic content loads
              window.addEventListener('load', () => {
                setTimeout(monitorDOMSize, 1000);
              });
              
              // Monitor periodically
              setInterval(monitorDOMSize, 10000);
            `
          }}
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
