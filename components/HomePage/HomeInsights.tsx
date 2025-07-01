"use client";

import React, { useEffect, useRef, useState } from "react";
import InsightSlider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";
import Image from "next/image";
import { leftArrow, rightArrow } from "../../utils/icons";
import configData from "../../config.json";

interface Insight {
  id: number;
  slug: string;
  imageUrl: string;
  title: string;
  desc: string;
}

export default function HomeInsights() {
  const sliderRef = useRef<InsightSlider>(null);
  const [insightsData, setInsightsData] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const domain = window.location.hostname;
        const isLiveDomain =
          domain === configData.LIVE_SITE_URL ||
          domain === configData.LIVE_SITE_URL_WWW;

        const server = isLiveDomain
          ? configData.LIVE_PRODUCTION_SERVER_ID
          : configData.STAG_PRODUCTION_SERVER_ID;

        const page = 8;
        const insightsResponse = await fetch(
          `${configData.SERVER_URL}posts?_embed&categories[]=13&status[]=publish&production_mode[]=${server}&per_page=${page}`
        );
        const posts = await insightsResponse.json();

        const latestInsights = posts
          .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 6)
          .map((item: any) => ({
            id: item.id,
            slug: item.slug,
            imageUrl:
              item._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
              "/insights/InsightsBanner.jpg",
            title: item.title.rendered,
            desc: item.excerpt.rendered,
          }));

        setInsightsData(latestInsights);
      } catch (error) {
        console.error("Failed to fetch insights:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInsights();
  }, []);

  const NextArrow = () => (
    <div
      className="cursor-pointer rounded-full bg-custom-blue p-3 text-xl text-white hover:bg-custom-red"
      onClick={() => sliderRef.current?.slickNext()}
    >
      {rightArrow}
    </div>
  );

  const PrevArrow = () => (
    <div
      className="cursor-pointer rounded-full bg-custom-blue p-3 text-xl text-white hover:bg-custom-red"
      onClick={() => sliderRef.current?.slickPrev()}
    >
      {leftArrow}
    </div>
  );

  const settings = {
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: false,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const SkeletonCard = () => (
    <div className="animate-pulse lg:ms-5 lg:p-4">
      <div className="h-[450px] w-full flex-col border border-gray-200 bg-white shadow lg:h-[620px]">
        <div className="h-[200px] w-full bg-gray-200 md:h-[280px]" />
        <div className="p-5 space-y-3">
          <div className="h-6 w-3/4 rounded bg-gray-300" />
          <div className="h-4 w-full rounded bg-gray-300" />
          <div className="h-4 w-5/6 rounded bg-gray-300" />
          <div className="h-10 w-24 rounded bg-gray-300 mt-5" />
        </div>
      </div>
    </div>
  );

  return (
    <section className="bg-white lg:mt-10 lg:w-11/12">
      <div className="flex flex-col lg:flex-row">
        {/* Title and Navigation */}
        <div className="flex justify-between lg:w-2/12">
          <div className="flex w-full items-center justify-evenly gap-7 lg:flex-col">
            <h2 className="m-0 py-5 text-2xl font-bold text-custom-red md:p-0 md:text-[80px] lg:-rotate-90">
              Insights
            </h2>
            <div className="hidden gap-4 md:flex">
              <PrevArrow />
              <NextArrow />
            </div>
          </div>
        </div>

        {/* Slider Content */}
        <div className="mx-auto w-11/12 lg:w-10/12">
          <InsightSlider ref={sliderRef} {...settings}>
            {isLoading
              ? [...Array(2)].map((_, i) => <SkeletonCard key={i} />)
              : insightsData.map((item, index) => (
                  <article key={item.id} className="lg:ms-5 lg:p-4">
                    <div className="group relative h-[450px] w-full border border-gray-200 bg-white shadow transition-colors duration-300 lg:h-[620px] md:hover:bg-custom-red md:hover:text-white">
                      <div className="relative h-[200px] w-full overflow-hidden bg-gray-200 md:h-[280px]">
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          width={400}
                          height={280}
                          className="size-full object-cover"
                          priority={index < 2}
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 400px"
                        />
                      </div>
                      <div className="flex flex-col items-start p-5 text-black transition-colors duration-300 md:group-hover:text-white">
                        <h3
                          className="mb-3 line-clamp-2 max-h-[4.5rem] min-h-12 overflow-hidden text-lg font-semibold text-custom-blue transition-colors duration-300 md:text-2xl md:group-hover:text-white"
                          dangerouslySetInnerHTML={{ __html: item.title }}
                        />
                        {item.desc && (
                          <p
                            className="mb-5 line-clamp-3 text-left text-sm font-normal text-custom-gray transition-colors duration-300 md:text-base md:group-hover:text-white lg:mt-10"
                            dangerouslySetInnerHTML={{ __html: item.desc }}
                          />
                        )}
                        <Link
                          href={`/insights/${item.slug}`}
                          className="absolute bottom-0 left-[35%] m-5 mx-auto block border border-custom-red p-2 text-custom-red transition-colors duration-300 hover:bg-white hover:text-black md:left-5 md:mx-0 md:px-6 md:group-hover:bg-white md:group-hover:text-black"
                        >
                          View Article
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
          </InsightSlider>

          <div className="mt-6 flex justify-center md:ms-3">
            <Link
              href="/insights"
              className="border border-custom-blue px-6 py-2 text-custom-blue md:hover:bg-custom-blue md:hover:text-white"
            >
              View all
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex items-center justify-center gap-4 pt-8 lg:hidden">
          <PrevArrow />
          <NextArrow />
        </div>
      </div>
    </section>
  );
} 