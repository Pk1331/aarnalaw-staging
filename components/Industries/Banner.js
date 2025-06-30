"use client"
import React, { useContext } from 'react';
import Image from 'next/image';
import { LanguageContext } from "../../app/context/LanguageContext";

export default function Banner() {
  const { language, translations } = useContext(LanguageContext);

  return (
    <div className="relative h-[600px]">
      <div className="relative h-full w-full">
        {/* Desktop banner */}
        <Image
          src="/Industries/IndutriesBanner.jpg"
          fill
          sizes="(min-width: 768px) 100vw, 0vw"
          priority
          className="hidden md:block object-cover"
          alt="Industries Banner"
          quality={90}
        />
        {/* Mobile banner */}
        <Image
          src="/Industries/IndustriesMobileBanner.jpg"
          fill
          sizes="(max-width: 767px) 100vw, 0vw"
          priority
          className="block md:hidden object-cover"
          alt="Industries Mobile Banner"
          quality={90}
        />
      </div>
      <div className="absolute bottom-0 flex h-[50vh] w-full items-center justify-center">
        <h1 className="md:text-5xl text-2xl font-bold text-white bg-black/50 p-4"> {translations.industriesTitle.industries}</h1>
      </div>
    </div>
  );
}
