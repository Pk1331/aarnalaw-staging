import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "./context/LanguageContext";
import { logPerformanceReport } from "../utils/performanceTest";

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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Performance monitoring script
              (function() {
                let lastReport = 0;
                const REPORT_INTERVAL = 2000; // Report every 2 seconds
                
                function measureDOM() {
                  if (typeof document === 'undefined') return;
                  
                  const elements = document.getElementsByTagName('*');
                  const totalElements = elements.length;
                  const currentTime = Date.now();
                  
                  // Only report if significant time has passed
                  if (currentTime - lastReport < REPORT_INTERVAL) return;
                  lastReport = currentTime;
                  
                  // Calculate DOM depth
                  function calculateDepth(element, depth = 0) {
                    const children = element.children;
                    if (children.length === 0) return depth;
                    
                    let maxDepth = depth;
                    for (let i = 0; i < children.length; i++) {
                      maxDepth = Math.max(maxDepth, calculateDepth(children[i], depth + 1));
                    }
                    return maxDepth;
                  }
                  
                  const maxDepth = calculateDepth(document.body);
                  
                  // Generate warnings
                  const warnings = [];
                  if (totalElements > 800) {
                    warnings.push(\`High DOM size: \${totalElements} elements\`);
                  }
                  if (maxDepth > 12) {
                    warnings.push(\`Deep DOM structure: \${maxDepth} levels\`);
                  }
                  
                  // Log performance data
                  if (warnings.length > 0) {
                    console.group('🚨 Performance Warning');
                    console.warn('DOM Size:', totalElements);
                    console.warn('Max Depth:', maxDepth);
                    console.warn('Warnings:', warnings);
                    console.groupEnd();
                  }
                }
                
                // Monitor DOM changes
                if (typeof window !== 'undefined') {
                  const observer = new MutationObserver(measureDOM);
                  observer.observe(document.body, {
                    childList: true,
                    subtree: true
                  });
                  
                  // Initial measurement
                  setTimeout(measureDOM, 1000);
                }
              })();
            `,
          }}
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