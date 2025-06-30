"use client";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";

const HomeInsights = ({ initialData = [], productionMode }) => {
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);

  // Memoize the limited data to prevent unnecessary re-renders
  const limitedData = useMemo(() => {
    return data.slice(0, 6);
  }, [data]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const cat1 = 12;
      const cat2 = 13;
      const url = `https://docs.aarnalaw.com/wp-json/wp/v2/posts?_embed&per_page=6&categories=${cat1},${cat2}&status[]=publish&production_mode[]=${productionMode}`;
      
      const response = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
      });
      
      const result = await response.json();
      
      if (Array.isArray(result)) {
        const sortedData = result.sort((a, b) => new Date(b.date) - new Date(a.date));
        setData(sortedData);
      }
    } catch (error) {
      console.error("Error fetching insights:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialData.length === 0) {
      fetchData();
    }
  }, [initialData.length]);

  const stripHTMLAndLimit = (htmlContent) => {
    const text = htmlContent.replace(/<\/?[^>]+(>|$)/g, "");
    return text.length > 150 ? text.substring(0, 150) + "..." : text;
  };

  const formatDateString = (dateString) => {
    const date = new Date(dateString);
    const monthAbbreviations = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const day = date.getDate();
    const month = monthAbbreviations[date.getMonth()];
    const year = date.getFullYear();
    return `${day}\n${month}\n${year}`;
  };

  if (isLoading) {
    return (
      <section className="w-11/12 mx-auto py-12">
        <div className="grid gap-6 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-80 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="w-11/12 mx-auto py-12">
      <div className="grid gap-6 lg:grid-cols-3">
        {limitedData.map((item, index) => (
          <article
            key={item.id}
            className="rounded-lg border border-gray-200 bg-white shadow transition-shadow hover:shadow-lg"
          >
            <Image
              src={item._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "/PracticeArea/Aarna-Law-Banner-img.png"}
              alt={item.title.rendered}
              className="h-48 w-full rounded-t-lg object-cover"
              width={400}
              height={300}
              priority={index < 3}
              loading={index < 3 ? "eager" : "lazy"}
            />
            <div className="p-4">
              <h3
                className="mb-2 line-clamp-2 text-lg font-bold tracking-tight text-gray-900"
                dangerouslySetInnerHTML={{ __html: item.title.rendered }}
              />
              <p
                className="mb-3 text-sm font-normal text-gray-700"
                dangerouslySetInnerHTML={{ __html: stripHTMLAndLimit(item.excerpt.rendered) }}
              />
              <time className="mb-3 block text-xs text-gray-500">
                {formatDateString(item.date)}
              </time>
              <Link 
                href={`/insights/${item.slug}`} 
                className="text-red-500 hover:text-red-600 font-medium"
              >
                Read more
              </Link>
            </div>
          </article>
        ))}
      </div>
      
      {limitedData.length > 0 && (
        <div className="mt-8 text-center">
          <Link
            href="/insights"
            className="inline-block bg-custom-red px-6 py-3 text-white hover:bg-red-600 transition-colors"
          >
            View All Insights
          </Link>
        </div>
      )}
    </section>
  );
};

export default HomeInsights; 