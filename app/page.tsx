import dynamic from 'next/dynamic';
import configData from '../config.json';

// Dynamically import all homepage components
const Banner = dynamic(() => import('../components/HomePage/Banner'), {
  ssr: true,
});

const HomeInsights = dynamic(
  () => import('@/components/HomePage/HomeInsights'),
  {
    ssr: false,
  }
);

const WhatWeDo = dynamic(() => import('../components/HomePage/WhatWeDo'), {
  ssr: false,
});
const KindOfDispute = dynamic(
  () => import('../components/HomePage/KindOfDisputesWeDo'),
  {
    ssr: false,
  }
);
const Testimonials = dynamic(
  () => import('../components/HomePage/Testimonials'),
  {
    ssr: true,
  }
);
const TrackRecords = dynamic(
  () => import('../components/HomePage/Trackrecords'),
  {
    ssr: false,
  }
);
const OurCredentials = dynamic(
  () => import('../components/HomePage/OurCredentials'),
  {
    ssr: false,
  }
);
const OurNetwork = dynamic(() => import('../components/HomePage/OurNetwork'), {
  ssr: false,
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

async function getInsights() {
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
      { next: { revalidate: 300 } }
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

export default async function Home() {
  const initialInsights = await getInsights();

  return (
    <>
      <Banner />
      <HomeInsights />
      <WhatWeDo />
      <KindOfDispute />
      <Testimonials />
      <TrackRecords />
      <OurCredentials />
      <OurNetwork />
    </>
  );
}