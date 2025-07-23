"use client";

import dynamic from 'next/dynamic';
import configData from '../config.json';
import React, { useEffect } from 'react';

// Dynamically import all homepage components
const Banner = dynamic(() => import('../components/HomePage/Banner'), {
  ssr: true,
  loading: () => <div className="h-[70vh] w-full bg-gray-100 animate-pulse" />, 
});

const HomeInsights = dynamic(() => import('@/components/HomePage/HomeInsights'), {
  ssr: true,
  loading: () => <div className="h-96 bg-gray-100 animate-pulse" />, 
});

const WhatWeDo = dynamic(() => import('../components/HomePage/WhatWeDo'), {
  ssr: true,
});

const KindOfDispute = dynamic(() => import('../components/HomePage/KindOfDisputesWeDo'), {
  ssr: false,
});

const Testimonials = dynamic(() => import('../components/HomePage/Testimonials'), {
  ssr: false,
});

const TrackRecords = dynamic(() => import('../components/HomePage/Trackrecords'), {
  ssr: false,
});

const OurCredentials = dynamic(() => import('../components/HomePage/OurCredentials'), {
  ssr: false,
});

const OurNetwork = dynamic(() => import('../components/HomePage/OurNetwork'), {
  ssr: false,
});

export default function Home() {
  useEffect(() => {
    const detectCity = async () => {
      const existingCity = localStorage.getItem("userCity");
      if (existingCity) return;
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
              );
              const data = await res.json();
              const detectedCity =
                data.address.city ||
                data.address.town ||
                data.address.village ||
                data.address.state ||
                "Unknown";
              console.log("Detected city:", detectedCity);
              localStorage.setItem("userCity", detectedCity);
              // Optional: also set in cookie for future SSR use
              document.cookie = `userCity=${detectedCity}; path=/; max-age=86400`;
            } catch (err) {
              console.error("Reverse geocoding failed:", err);
            }
          },
          (error) => {
            console.warn("Geolocation access denied or failed:", error);
          }
        );
      }
    };
    detectCity();
    // --- IP ADDRESS BASED (COMMENTED OUT) ---
    // Example: fetch('https://api.ipgeolocation.io/ipgeo?apiKey=...')
  }, []);

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
