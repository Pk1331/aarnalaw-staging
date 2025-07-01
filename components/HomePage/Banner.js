"use client";
import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { homeBanner } from "../../utils/homebanner-data"; // Ensure the path is correct

export default function Banner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Memoize banner data to prevent unnecessary re-renders
  const bannerData = useMemo(() => {
    return homeBanner && homeBanner.length > 0 ? homeBanner : [];
  }, []);

  useEffect(() => {
    if (bannerData.length <= 1) return; // Don't set interval if only one banner

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerData.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [bannerData.length]);

  // Early return if no banner data
  if (bannerData.length === 0) {
    return (
      <div className="relative h-[70vh] w-full lg:h-screen bg-gray-300 flex items-center justify-center">
        <p className="text-gray-600">Loading banner...</p>
      </div>
    );
  }

  return (
    <div
      id="default-carousel"
      className="relative h-[70vh] w-full lg:h-screen"
      data-carousel="slide"
    >
      <div className="relative h-screen overflow-hidden">
        {bannerData.map((banner, index) => (
          <div
            key={index}
            className={`relative w-full ${index === currentIndex ? "block" : "hidden"}`}
            data-carousel-item
          >
            {/* Mobile Banner */}
            <div className="relative w-full h-[70vh] aspect-[414/500] lg:hidden">
              <Image
                src={banner.mobileBannerUrl}
                alt={banner.bannerText}
                fill
                sizes="(max-width: 768px) 100vw, 0vw"
                style={{ objectFit: 'cover' }}
                loading={index === 0 ? "eager" : "lazy"}
                priority={index === 0}
                quality={85}
              />
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 text-center text-white mt-40">
                <h2 className="text-4xl font-bold lg:text-5xl">{banner.bannerText}</h2>
                <p className="py-8 text-xl lg:w-7/12">{banner.bannerPara}</p>
              </div>
            </div>
            {/* Desktop Banner */}
            <div className="relative w-full h-screen aspect-[1335/940] hidden lg:block">
              <Image
                src={banner.bannerUrl}
                alt={banner.bannerText}
                fill
                sizes="(min-width: 1024px) 100vw, 0vw"
                style={{ objectFit: 'cover' }}
                loading={index === 0 ? "eager" : "lazy"}
                priority={index === 0}
                quality={85}
              />
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 text-center text-white">
                <h2 className="text-4xl font-bold lg:text-5xl">{banner.bannerText}</h2>
                <p className="py-8 text-xl lg:w-7/12">{banner.bannerPara}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}