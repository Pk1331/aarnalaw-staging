"use client";
import React, { useState, useRef } from "react";
import { IoIosArrowDown } from "react-icons/io";

const Faq = ({ faqs = [] }) => {
  const [openIndex, setOpenIndex] = useState(null);
  const contentRefs = useRef([]);

  const toggleFAQ = (index) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const renderAnswer = (answer) => {
    const hasList = /<ul>|<li>|•/i.test(answer);
    const hasParagraphs = /<p>/i.test(answer);

    // Clean malformed paragraph HTML
    let cleanedAnswer = answer
      .replace(/<p>(\s*)<\/p>/gi, "") // remove empty <p></p>
      .replace(/<p>(.*?)<p>/gi, "<p>$1</p><p>") // fix missing </p> before a new <p>
      .replace(/<\/p>\s*<\/p>/gi, "</p>"); // remove duplicate </p>

    if (hasList) {
      cleanedAnswer = cleanedAnswer.replace(
        /<li>/g,
        `<li class="pl-5 py-2 relative before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1.5 before:h-1.5 before:bg-red-500 before:rounded-full">`
      );

      return (
        <div
          className="mt-3 text-gray-700 text-sm sm:text-base"
          dangerouslySetInnerHTML={{ __html: cleanedAnswer }}
        />
      );
    }

    if (hasParagraphs) {
      return (
        <div
          className="mt-3 text-gray-700 text-sm sm:text-base space-y-3"
          dangerouslySetInnerHTML={{ __html: cleanedAnswer }}
        />
      );
    }

    // Fallback for plain text answers
    const paragraphs = answer.split(/\n\s*\n/);
    return (
      <div className="mt-3 text-gray-700 text-sm sm:text-base space-y-3">
        {paragraphs.map((para, idx) => (
          <p key={idx}>{para}</p>
        ))}
      </div>
    );
  };

  return (
    <section className="max-w-4xl container mx-auto py-6 sm:py-12 px-4 md:px-0">
      {faqs.length > 0 && (
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
          Frequently Asked Questions
        </h2>
      )}
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <article
            key={index}
            className="bg-white shadow-md rounded-2xl p-4 sm:p-6 transition-all duration-300"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center text-left"
            >
              <h3 className="flex-1 text-base sm:text-lg font-semibold mr-3">
                {faq.question}
              </h3>
              <IoIosArrowDown
                className={`transition-transform duration-300 ${
                  openIndex === index ? "rotate-180" : ""
                }`}
                size={24}
              />
            </button>

            <div
              ref={(el) => (contentRefs.current[index] = el)}
              style={{
                maxHeight:
                  openIndex === index
                    ? `${contentRefs.current[index]?.scrollHeight}px`
                    : "0px",
              }}
              className="overflow-hidden transition-all duration-500 ease-in-out"
            >
              {renderAnswer(faq.answer)}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Faq;
