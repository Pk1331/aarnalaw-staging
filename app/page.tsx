import dynamic from 'next/dynamic';
import configData from '../config.json';
import { Suspense } from 'react';

// Critical above-the-fold components - load immediately
const Banner = dynamic(() => import('../components/HomePage/Banner'), {
  ssr: true, // Enable SSR for critical content
  loading: () => <div className="h-[70vh] w-full bg-gray-100 animate-pulse" />,
});

// High priority components - load after banner
const HomeInsights = dynamic(
  () => import('@/components/HomePage/HomeInsights'),
  {
    ssr: true, // Enable SSR for better SEO and initial load
    loading: () => <div className="h-96 bg-gray-100 animate-pulse" />,
  }
);

const WhatWeDo = dynamic(() => import('../components/HomePage/WhatWeDo'), {
  ssr: true, // Enable SSR
  loading: () => <div className="h-96 bg-gray-100 animate-pulse" />,
});

// Medium priority components - load with delay
const KindOfDispute = dynamic(
  () => import('../components/HomePage/KindOfDisputesWeDo'),
  {
    ssr: false, // Keep client-side for interactive features
    loading: () => <div className="h-96 bg-gray-100 animate-pulse" />,
  }
);

// Lower priority components - load last
const Testimonials = dynamic(
  () => import('../components/HomePage/Testimonials'),
  {
    ssr: false, // Keep client-side for carousel functionality
    loading: () => <div className="h-96 bg-gray-100 animate-pulse" />,
  }
);

const TrackRecords = dynamic(
  () => import('../components/HomePage/Trackrecords'),
  {
    ssr: false,
    loading: () => <div className="h-96 bg-gray-100 animate-pulse" />,
  }
);

const OurCredentials = dynamic(
  () => import('../components/HomePage/OurCredentials'),
  {
    ssr: false, // Keep client-side for carousel
    loading: () => <div className="h-96 bg-gray-100 animate-pulse" />,
  }
);

const OurNetwork = dynamic(() => import('../components/HomePage/OurNetwork'), {
  ssr: false, // Keep client-side for map loading
  loading: () => <div className="h-96 bg-gray-100 animate-pulse" />,
});

export const metadata = {
  title: 'Aarna Law - Leading Law Firm in India',
  description:
    'Aarna Law is a leading law firm in India specializing in arbitration, litigation, and corporate advisory services.',
  metadataBase: new URL('https://www.aarnalaw.com'),
  alternates: {
    canonical: 'https://aarnalaw.com/',
  },
  openGraph: {
    title: 'Aarna Law - Top Litigation, Dispute & Corporate Law Firm in India',
    description:
      'Leading corporate law firm in India offering legal services in business law, litigation, arbitration, and compliance for Indian and international companies.',
    url: 'https://aarnalaw.com/',
    images: '/banner/desktop_home_banner_2.jpg',
  },
};

interface InsightPost {
  id: number;
  date: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  slug: string;
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string }>;
  };
}

interface ProcessedInsight {
  id: number;
  imageUrl: string;
  title: string;
  desc: string;
  slug: string;
}

async function getInsights(): Promise<ProcessedInsight[]> {
  try {
    const domain =
      process.env.NODE_ENV === 'production'
        ? configData.LIVE_SITE_URL
        : configData.STAGING_SITE_URL;

    const server =
      domain === configData.LIVE_SITE_URL
        ? configData.LIVE_PRODUCTION_SERVER_ID
        : configData.STAG_PRODUCTION_SERVER_ID;

    const page = 8;
    const insightsResponse = await fetch(
      `${configData.SERVER_URL}posts?_embed&categories[]=13&status[]=publish&production_mode[]=${server}&per_page=${page}`,
      { 
        next: { revalidate: 300 },
        headers: {
          'Cache-Control': 'public, max-age=300, stale-while-revalidate=600'
        }
      }
    );

    if (!insightsResponse.ok) {
      throw new Error('Failed to fetch insights');
    }

    const posts: InsightPost[] = await insightsResponse.json();

    return posts
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 6)
      .map((item) => ({
        id: item.id,
        imageUrl: item._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
        title: item.title.rendered,
        desc: item.excerpt.rendered,
        slug: item.slug,
      }));
  } catch (error) {
    console.error('Error fetching insights:', error);
    return [];
  }
}

// Loading components for better UX
const LoadingSection = ({ height = "h-96" }: { height?: string }) => (
  <div className={`w-full bg-gray-100 animate-pulse ${height}`} />
);

export default async function Home() {
  const initialInsights = await getInsights();

  return (
    <>
      {/* Critical above-the-fold content */}
      <Banner />
      
      {/* High priority content */}
      <Suspense fallback={<LoadingSection />}>
        <HomeInsights initialInsights={initialInsights} />
      </Suspense>
      
      <Suspense fallback={<LoadingSection />}>
        <WhatWeDo />
      </Suspense>
      
      {/* Medium priority content */}
      <Suspense fallback={<LoadingSection />}>
        <KindOfDispute />
      </Suspense>
      
      {/* Lower priority content - load after user interaction */}
      <Suspense fallback={<LoadingSection />}>
        <Testimonials />
      </Suspense>
      
      <Suspense fallback={<LoadingSection />}>
        <TrackRecords />
      </Suspense>
      
      <Suspense fallback={<LoadingSection />}>
        <OurCredentials />
      </Suspense>
      
      <Suspense fallback={<LoadingSection />}>
        <OurNetwork />
      </Suspense>
    </>
  );
}