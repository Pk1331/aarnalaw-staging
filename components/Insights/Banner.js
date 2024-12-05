import React from "react";

export default function Banner({ title }) {
  const getTitle = () => {
    switch (title) {
      case "insight":
        return "Insights";
      case "aarna-news":
        return "Aarna News";
      case "publication":
        return "Publication";
      case "podcast":
        return "Podcast";
      default:
        return "Aarna Law"; // Fallback title if input is not recognized
    }
  };

  return (
    <div className="relative h-[60vh] md:bg-[url('/insights/InsightsBanner.jpg')] bg-[url('/insights/InsightsMobileBanner.jpg')] bg-cover bg-center">
      <div className="absolute bottom-0 flex h-[50vh] w-full items-center justify-center bg-black/50">
        <h1 className="text-5xl font-bold tracking-wide text-white">
          {getTitle()}
        </h1>
      </div>
    </div>
  );
}
