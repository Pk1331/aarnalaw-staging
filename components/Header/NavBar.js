"use client";
import React, { useState, useEffect, useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { HeaderMenu } from "../../utils/data";
import SearchModal from "@/components/Header/SearchModal";
import { LanguageContext } from "../../app/context/LanguageContext";
import LanguageDropdown from "../Header/LanguageDropdown";

const NavBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage, translations } = useContext(LanguageContext);
  const newsPaths = ["/aarna-news", "/insight", "/publication", "/podcast"];

  // Function to format translation keys
  const formatKey = (key) => key.toLowerCase().replace(/[^a-z0-9]+/g, "");

  useEffect(() => {
    // Scroll to top whenever pathname changes (page load or route change)
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });

    if (pathname === "/podcast") {
      router.replace("/podcasts");
    }

    // Close menu on route change
    setIsMenuOpen(false);
  }, [pathname, router]);

  return (
    <div className="relative z-50 mx-auto w-11/12">
      <div className="absolute right-0 mt-5 origin-top-right ring-1 ring-black ring-opacity-5 focus:outline-none">
        <LanguageDropdown handleOptionClick={setLanguage} />
      </div>

      <nav className="absolute z-50 mx-auto mt-20 w-full border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
        <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between px-4 md:px-0 py-2">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo/aarna-logo.png"
              alt="Aarna Law Logo"
              width={80}
              height={80}
              className="size-16 md:size-20"
              loading="eager"
              priority
              sizes="(max-width: 768px) 64px, 80px"
            />
          </Link>

          <div className="flex w-2/5 justify-end lg:hidden">
            <SearchModal />
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="inline-flex size-10 items-center justify-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 md:hidden"
            aria-controls="navbar-dropdown"
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="size-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>

          <div className={`${isMenuOpen ? "block" : "hidden"} w-full md:block md:w-auto `} id="navbar-dropdown">
            <ul className="borderfont-medium mt-1 flex flex-col rounded-lg dark:border-gray-700 md:flex-row md:space-x-3">
              {HeaderMenu.map((item, index) => {
                const isContactUs = item.menu === "Contact Us";

                return (
                  <li
                    key={index}
                    className={`group relative ${isContactUs ? "md:hidden" : ""}`}
                  >
                    {item.aboutSubMenu || item.subMenu ? (
                      <span className="flex cursor-pointer items-center px-3 py-2 md:hover:text-custom-red">
                        {translations.menu[formatKey(item.menu)] || item.menu}
                        <span className="ml-1 text-sm">&#9662;</span>
                      </span>
                    ) : (
                      <Link
                        href={item.slug || "#"}
                        className="flex items-center px-3 py-2 md:hover:text-custom-red"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {translations.menu[formatKey(item.menu)] || item.menu}
                      </Link>
                    )}

                    {(item.aboutSubMenu || item.subMenu) && (
                      <ul className="absolute z-10 hidden w-48 rounded-lg bg-white p-2 shadow-lg group-hover:block">
                        {(item.aboutSubMenu || item.subMenu).map((sub, subIndex) => (
                          <li key={subIndex}>
                            <Link
                              href={sub.slug || "#"}
                              className="block px-4 py-2 hover:bg-gray-100"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {translations.menu[formatKey(sub.name)] || sub.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Contact us for desktop view */}
          <div className="hidden w-3/12 items-center justify-evenly lg:flex">
            <SearchModal />
            <Link
              href="/contact-us"
              className="my-2 me-2 border border-custom-red bg-white px-5 py-2.5 text-sm font-medium text-custom-red hover:bg-custom-red hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              {translations.menu.contactus || "CONTACT US"}
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
