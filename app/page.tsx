import Banner from '../components/HomePage/Banner';
import HomeInsights from '@/components/HomePage/HomeInsights';
import WhatWeDo from '../components/HomePage/WhatWeDo';
import KindOfDispute from '../components/HomePage/KindOfDisputesWeDo';
import Testimonials from '../components/HomePage/Testimonials';
import TrackRecords from '../components/HomePage/Trackrecords';
import OurCredentials from '../components/HomePage/OurCredentials';
import OurNetwork from '../components/HomePage/OurNetwork';
import configData from '../config.json';

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
        next: { revalidate: 0 },
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

export default async function Home() {
  const initialInsights = await getInsights();

  return (
    <>
      <Banner />
      <HomeInsights initialInsights={initialInsights} />
      <WhatWeDo />
      <KindOfDispute />
      <Testimonials />
      <TrackRecords />
      <OurCredentials />
      <OurNetwork />
    </>
  );
}