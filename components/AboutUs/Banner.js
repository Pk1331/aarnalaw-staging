import React, { useContext } from "react";
import { LanguageContext } from "../../app/context/LanguageContext";
import Image from "next/image";

export default function Banner() {
  const { translations } = useContext(LanguageContext);
  return (
    <div className="relative h-[600px]">
      <Image
        src="/aboutUs/aboutusbanner.png"
        alt="About Us"
        fill
        sizes="100vw"
        priority={true}
        className="object-cover"
        quality={75}
      />
      <div className="absolute bottom-0 flex h-[50vh] w-full items-center justify-center z-10">
        <h1 className="text-5xl font-bold text-white bg-black/50 p-4"> {translations.aboutTitle.aboutName} </h1>
      </div>
    </div>
  );
}
