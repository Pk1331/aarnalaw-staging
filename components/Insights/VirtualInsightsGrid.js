"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import VirtualList from "../VirtualList/VirtualList";

const VirtualInsightsGrid = ({ 
  data = [], 
  searchTerm = "", 
  onLoadMore, 
  hasMore = false, 
  isLoadingMore = false 
}) => {
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredData(data);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered = data.filter(item => {
      const title = item.title.rendered.toLowerCase();
      const content = item.content.rendered.toLowerCase();
      const excerpt = item.excerpt.rendered.toLowerCase();
      return (
        title.includes(searchLower) ||
        content.includes(searchLower) ||
        excerpt.includes(searchLower)
      );
    });

    setFilteredData(filtered);
  }, [data, searchTerm]);

  const stripHTMLAndLimit = (htmlContent) => {
    const text = htmlContent.replace(/<\/?[^>]+(>|$)/g, "");
    return text.length > 255 ? text.substring(0, 255) + "..." : text;
  };

  const formatDateString = (dateString) => {
    const date = new Date(dateString);
    const monthAbbreviations = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const day = date.getDate();
    const month = monthAbbreviations[date.getMonth()];
    const year = date.getFullYear();
    return `${day}\n${month}\n${year}`;
  };

  const renderInsightItem = (item, index) => (
    <article className="rounded-lg border border-gray-200 bg-white shadow transition-opacity duration-300 p-4">
      <Image
        src={item._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "/PracticeArea/Aarna-Law-Banner-img.png"}
        alt={item.title.rendered}
        className="h-[200px] w-full rounded-t-lg object-cover"
        width={500}
        height={300}
        priority={index < 4}
      />
      <div className="p-3">
        <h3
          className="mb-2 line-clamp-2 min-h-10 text-lg font-bold tracking-tight text-gray-900"
          dangerouslySetInnerHTML={{ __html: item.title.rendered }}
        />
        <p
          className="my-3 min-h-20 text-sm font-normal text-gray-700"
          dangerouslySetInnerHTML={{ __html: stripHTMLAndLimit(item.excerpt.rendered) }}
        />
        <time className="pb-2 text-xs text-gray-500 block">
          {formatDateString(item.date)}
        </time>
        <Link href={`/insights/${item.slug}`} className="text-red-500">
          Read more
        </Link>
      </div>
    </article>
  );

  if (filteredData.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          No results found {searchTerm ? `for "${searchTerm}"` : ""}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <VirtualList
        items={filteredData}
        itemHeight={400}
        containerHeight={800}
        renderItem={renderInsightItem}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      />
      
      {hasMore && (
        <div className="text-center mt-6">
          {isLoadingMore ? (
            <div className="inline-block px-4 py-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500"></div>
            </div>
          ) : (
            <button
              onClick={onLoadMore}
              className="bg-custom-red px-4 py-2 text-white hover:bg-red-600 active:bg-red-700"
            >
              Load More
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default VirtualInsightsGrid; 