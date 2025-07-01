import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "./context/LanguageContext";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Aarna Law - Leading Law Firm in India",
  description: "Aarna Law is a leading law firm in India, providing comprehensive legal services across various practice areas including corporate law, litigation, and more.",
  metadataBase: new URL('https://aarnalaw.com'),
  openGraph: {
    title: "Aarna Law - Leading Law Firm in India",
    description: "Aarna Law is a leading law firm in India, providing comprehensive legal services across various practice areas including corporate law, litigation, and more.",
    url: 'https://aarnalaw.com',
    siteName: 'Aarna Law',
    images: [
      {
        url: '/PracticeArea/Aarna-Law-Banner-img.png',
        width: 1200,
        height: 630,
        alt: 'Aarna Law',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Aarna Law - Leading Law Firm in India",
    description: "Aarna Law is a leading law firm in India, providing comprehensive legal services across various practice areas including corporate law, litigation, and more.",
    images: ['/PracticeArea/Aarna-Law-Banner-img.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-YWL8EWE9MB"
          strategy="afterInteractive"
        />
        <Script
          src="https://www.googletagmanager.com/gtm.js?id=GTM-WJW9WNHQ"
          strategy="afterInteractive"
        />
        <Script
          src="https://www.clarity.ms/s/0.8.13-beta/clarity.js"
          strategy="lazyOnload"
        />
      </head>
      <body className={inter.className} suppressHydrationWarning={true}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
} 