"use client";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import VirtualInsightsGrid from "./VirtualInsightsGrid";
import { logPerformanceReport } from "../../utils/performanceTest";

function LoadingDots() {
  return (
    <div className="inline-flex items-center text-black">
      Loading
      <span className="loading-dots">
        <span className="dot">.</span>
        <span className="dot">.</span>
        <span className="dot">.</span>
      </span>
      <style jsx>{`
        .loading-dots {
          display: inline-flex;
        }
        .dot {
          animation: dotFade 1.4s infinite;
          opacity: 0;
          margin-left: 2px;
        }
        .dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        .dot:nth-child(3) {
          animation-delay: 0.4s;
        }
        @keyframes dotFade {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function AllInsights({
  searchTerm,
  initialData = [],
  initialArchives = [],
  initialYear,
  productionMode,
}) {
  const [data, setData] = useState(initialData);
  const [archives, setArchives] = useState(initialArchives);
  const [selectedArchive, setSelectedArchive] = useState(initialYear || (initialArchives[0]?.name ?? null));
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false); 
  const [isChangingArchive, setIsChangingArchive] = useState(false);

  // Memoize filtered data to prevent unnecessary re-renders
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    
    const searchLower = searchTerm.toLowerCase();
    return data.filter(item => {
      const title = item.title.rendered.toLowerCase();
      const content = item.content.rendered.toLowerCase();
      const excerpt = item.excerpt.rendered.toLowerCase();
      return (
        title.includes(searchLower) ||
        content.includes(searchLower) ||
        excerpt.includes(searchLower)
      );
    });
  }, [data, searchTerm]);

  const fetchData = async (year, pageNum = 1, append = false) => {
    const cat1 = 12;
    const cat2 = 13;
    const after = `${year}-01-01T00:00:00`;
    const before = `${year}-12-31T23:59:59`;
    const url = `https://docs.aarnalaw.com/wp-json/wp/v2/posts?_embed&per_page=6&page=${pageNum}&categories=${cat1},${cat2}&after=${after}&before=${before}&status[]=publish&production_mode[]=${productionMode}`;

    try {
      const response = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await response.json();

      if (Array.isArray(result)) {
        const sortedData = result.sort((a, b) => new Date(b.date) - new Date(a.date));
        if (append) {
          const newData = [...data, ...sortedData];
          setData(newData);
        } else {
          if (year === selectedArchive) {
            setData(sortedData);
          }
        }
        setHasMore(sortedData.length === 6);
      }
      setIsChangingArchive(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsChangingArchive(false);
    }
  };

  useEffect(() => {
    if (selectedArchive) {
      setIsChangingArchive(true);
      fetchData(selectedArchive, 1, false);
    }
  }, [selectedArchive]);

  const loadMore = async () => {
    setIsLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchData(selectedArchive, nextPage, true);
    setIsLoadingMore(false);
  };

  // Monitor performance after data loads
  useEffect(() => {
    if (data.length > 0 && !isChangingArchive) {
      setTimeout(() => {
        logPerformanceReport();
      }, 500);
    }
  }, [data.length, isChangingArchive]);

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

  return (
    <main className="flex w-full flex-col md:flex-row">
      {/* Main Content */}
      <section className="mx-auto w-full lg:w-9/12 lg:p-12">
        {filteredData.length === 0 ? (
          <div className="text-center py-8">
            {isChangingArchive ? (
              <LoadingDots />
            ) : (
              <p className="text-gray-500">
                No results found {searchTerm ? `for "${searchTerm}"` : ""}
              </p>
            )}
          </div>
        ) : (
          <VirtualInsightsGrid
            data={filteredData}
            searchTerm={searchTerm}
            onLoadMore={loadMore}
            hasMore={hasMore}
            isLoadingMore={isLoadingMore}
          />
        )}
      </section>

      {/* Sidebar Archives */}
      <aside className="mt-8 w-full bg-gray-50 p-4 pb-12 md:mt-0 md:w-3/12 md:p-4 lg:ml-8">
        <h2 className="font-bold">Archives</h2>
        <hr className="my-4 border-t-2 border-red-500" />
        <nav className="space-y-4 text-left text-gray-500">
          {archives.map((archive) => (
            <button
              onClick={() => {
                setSelectedArchive(archive.name);
                setPage(1);
              }}
              className={`flex w-full border-b border-red-500 p-1 ${
                selectedArchive === archive.name
                  ? "font-bold text-red-500"
                  : "hover:text-red-500"
              }`}
              key={archive.id}
              disabled={isChangingArchive}
            >
              <span dangerouslySetInnerHTML={{ __html: archive.name }} />
            </button>
          ))}
        </nav>
      </aside>
    </main>
  );
}

export default AllInsights;
