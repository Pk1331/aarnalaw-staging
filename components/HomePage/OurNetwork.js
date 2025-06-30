"use client";
import React, { useContext, useState, useEffect } from "react";
import { LanguageContext } from "../../app/context/LanguageContext";

function OurNetwork() {
  const { language, translations } = useContext(LanguageContext);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    // Delay loading the map to improve initial page performance
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 2000); // Increased delay to reduce initial load impact

    return () => clearTimeout(timer);
  }, []);

  const handleMapLoad = () => {
    // Map loaded successfully
    console.log('Google Maps iframe loaded successfully');
  };

  const handleMapError = () => {
    setMapError(true);
    console.error('Failed to load Google Maps iframe');
  };

  return (
    <>
      <style>
        {
          `
 .qqvbed-p83tee-V1ur5d {
    text-transform: capitalize !important;
} 
`
        }
      </style>
      <div className="mx-auto w-11/12">
        <h1 className="pb-8 pt-12 text-center text-xl font-semibold text-custom-blue md:text-2xl">
          {translations.network.networkTitle}
        </h1>
        <div className="w-full bg-gray-800 py-1 text-white">
          <p className="p-4 font-semibold">Aarna Law - Our Networks</p>
          <div className="w-full overflow-hidden">
            <div className="w-full overflow-hidden">
              {mapLoaded && !mapError ? (
                <iframe
                  src="https://www.google.com/maps/d/embed?mid=1VcQJ5rncecjuzGEyGAVCekUkRYoLUpQ&ehbc=2E312F"
                  width="100%"
                  height="600"
                  className="mt-[-61px] border-0"
                  title="Aarna Law Office Network Map"
                  loading="lazy"
                  onLoad={handleMapLoad}
                  onError={handleMapError}
                  sandbox="allow-scripts allow-same-origin allow-forms"
                />
              ) : mapError ? (
                <div className="mt-[-61px] h-[600px] bg-gray-300 flex items-center justify-center">
                  <div className="text-gray-600 text-center">
                    <p>Unable to load map</p>
                    <button 
                      onClick={() => {
                        setMapError(false);
                        setMapLoaded(true);
                      }}
                      className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-[-61px] h-[600px] bg-gray-300 flex items-center justify-center">
                  <div className="text-gray-600">Loading map...</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OurNetwork;
