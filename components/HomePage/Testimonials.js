"use client";

import React, { useRef, useState, useContext } from "react";
import InsightSlider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { testimonials } from "../../utils/data";
// import TestimonialsCard from "./TestimonialsCard";
import { leftArrow, rightArrow } from "../../utils/icons";
import Link from "next/link";
import Image from "next/image";
import { LanguageContext } from "../../app/context/LanguageContext";

const Testimonials = () => {
  const sliderRef = useRef(null);

  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const { language, translations } = useContext(LanguageContext);


  const NextArrow = () => (
    <button
      onClick={() => sliderRef.current?.slickNext()}
      className="flex h-8 w-8 items-center justify-center rounded-full bg-custom-blue text-white hover:bg-blue-600"
    >
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </button>
  );

  const PrevArrow = () => (
    <button
      onClick={() => sliderRef.current?.slickPrev()}
      className="flex h-8 w-8 items-center justify-center rounded-full bg-custom-blue text-white hover:bg-blue-600"
    >
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>
  );

  const setting = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <>
      <div className="relative mx-auto mb-14 w-11/12">
        <h2 className="block py-5 text-center text-2xl font-semibold text-custom-blue md:hidden">
          Client's Testimonials
        </h2>

        <div className="mr-1 flex justify-end ">
          <Image
            src="/images/quotes.svg"
            className="hidden md:block"
            width={276}
            height={215}
            alt="testimonials"
             loading="lazy"
          />
        </div>
        <div className="mt-2 flex justify-between md:-mt-36">
          <div className="h-96 w-[260px] bg-custom-blue md:h-[437px] md:w-[559px]"></div>
          <div className="mr-1 space-y-6 self-end text-right md:mr-28">
            <h2 className="hidden p-2 text-xl font-semibold text-custom-blue md:block md:text-2xl">
              Client's <br /> Testimonials
            </h2>
            <div className="flex justify-end gap-2">
              <PrevArrow />
              <NextArrow />
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 w-full gap-10 md:bottom-28 md:right-[200px] md:w-3/4">
          <InsightSlider ref={sliderRef} {...setting}>
          {translations.testimonialDetails.map((items, index) =>(
              <div key={index} className="h-full">
                <div className="mx-2 mb-10 flex h-[250px] w-auto flex-col justify-center gap-1 bg-white p-5 shadow-lg md:w-[460px]">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="h-32">
                        <h3 className="text-xl font-semibold text-custom-blue md:text-2xl">
                          {items.name}
                        </h3>
                        <p className="text-sm text-custom-gray md:text-lg">
                          {items.post}
                        </p>
                        <p className="text-sm text-custom-gray md:text-lg">
                          {items.desingnation}
                        </p>
                      </div>
                    </div>
                    <div className="mb-8">
                      <Image
                        src={items.imageUrl}
                        width={90}
                        height={90}
                        className="object-cover"
                        alt={items.name}
                        loading="lazy"
                        style={{ width: 'auto', height: 'auto' }}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="line-clamp-2 text-sm leading-tight text-custom-gray">
                      {items.desc}
                    </p>
                  </div>
                  <Link href="/testimonials" className="text-custom-blue">
                    Read more
                  </Link>
                </div>
              </div>
            ))}
          </InsightSlider>
        </div>
      </div>
    </>
  );
};

export default Testimonials;
