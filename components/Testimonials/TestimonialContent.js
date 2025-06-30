"use client";
import React, { useState, useContext } from "react";
import { LanguageContext } from "../../app/context/LanguageContext";
import ModalTestimonial from "@/components/ContactUs/Modal";
import Image from "next/image";

function Testimonials() {
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const { language, translations } = useContext(LanguageContext); 

  const handleOpenModal = (testimonial) => {
    setSelectedTestimonial(testimonial);
  };

  return (
    <section className="w-11/12 mx-auto py-12">
      <div className="grid gap-10 lg:grid-cols-3">
        {translations.testimonialDetails.map((items, index) => (
          <article
            className="flex flex-col rounded-lg bg-white shadow-lg"
            key={index}
          >
            {/* Header: Info and Image */}
            <header className="flex items-center p-6">
              <div className="flex-1">
                <h2 className="text-lg font-bold md:h-12">{items.name}</h2>
                <p className="py-2 md:h-10">{items.post}</p>
                <p className="py-2 md:h-10">{items.desingnation}</p>
              </div>
              <Image
                src={items.imageUrl}
                width={90}
                height={90}
                className="ml-4 rounded-full object-cover"
                alt={items.name}
                loading="lazy"
              />
            </header>

            {/* Content: Testimonial */}
            <div className="px-6 pb-6">
              <p className="line-clamp-4 text-gray-700">
                {items.fullTestimonial.slice(0, 150)}...
              </p>
              <button
                className="pt-4 text-custom-red font-medium"
                onClick={() => handleOpenModal(items)}
              >
                {translations.readMore || "Read more"}
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Modal */}
      {selectedTestimonial && (
        <ModalTestimonial
          data={selectedTestimonial}
          onClose={() => setSelectedTestimonial(null)}
        />
      )}
    </section>
  );
}

export default Testimonials;
