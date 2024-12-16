import React from "react";

export default function Banner() {
  return (
    <div className="relative h-[70vh] md:bg-[url('/Industries/IndutriesBanner.jpg')] bg-[url('/Industries/IndustriesMobileBanner.jpg')] bg-cover bg-center">
      <div className="absolute bottom-0 flex h-[50vh] w-full items-center justify-center">
        <h1 className="text-5xl font-bold text-white">Industries</h1>
      </div>
    </div>
  );
}
