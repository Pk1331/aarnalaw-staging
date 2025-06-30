"use client";
import React, { useRef, useState, useEffect, useContext } from "react";
import Link from "next/link";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { credentials } from "../../utils/data";
import Image from "next/image";
import { LanguageContext } from "../../app/context/LanguageContext";

const Podcasts = () => {
  const { language, translations } = useContext(LanguageContext);
  const sliderRef = useRef(null);
  const sectionRef = useRef(null);

  const [isDesktop, setIsDesktop] = useState(false);
  const [inView, setInView] = useState(false); // Track visibility

  // Track screen size
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Use Intersection Observer to detect visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.2 } // Trigger when 20% of the component is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 4 },
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 4 },
    tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
  };

  return (
    <div className="bg-[#EFEFEF] py-12" ref={sectionRef}>
      <div className="mx-auto w-11/12">
        <h1 className="mb-10 text-center text-2xl font-semibold text-custom-red">
          {translations.awards.awardsTitle}
        </h1>

        <Carousel
          ref={sliderRef}
          responsive={responsive}
          showDots={false}
          infinite={true}
          autoPlaySpeed={isDesktop ? 2000 : 3000}
          autoPlay={inView} // 👈 Only autoplay when in view
          itemClass="p-1"
          keyBoardControl={true}
          removeArrowOnDeviceType={["tablet", "mobile", "desktop"]}
        >
          {credentials.map((item, index) => (
            <div
              className="inset-0 flex h-[200px] flex-col items-center justify-start"
              key={index}
            >
              <Image
                src={item.imageUrl}
                width={500}
                height={500}
                className="h-[100px] w-[200px]"
                alt={item.title}
                loading={index === 0 ? "eager" : "lazy"}
                priority={index === 0}
              />
              <h2 className="font-bold mt-3">{item.title}</h2>
              <p className="text-center text-sm">{item.desc}</p>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default Podcasts;
