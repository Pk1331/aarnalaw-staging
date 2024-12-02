"use client";
import React, { useEffect, useState } from "react";
import Banner from "@/components/Insights/InsidePage/Banner";
import Link from "next/link";
import ErrorPage from "@/components/404/page";

export default function Page({ params }) {
  const paramUrl = params.slug;
  const [title, setTitle] = useState(null);
  const [date, setDate] = useState(null);
  const [featureImage, setFeatureImage] = useState(null);
  const [content, setContent] = useState(null);
  const [error, setError] = useState(false); // Error state to handle error page

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://docs.aarnalaw.com/wp-json/wp/v2/posts?_embed&slug=${paramUrl}`,
        );
        const data = await response.json();
        if (data && data.length > 0) {
          const post = data[0];
          setTitle(post.title.rendered);
          setDate(post.date);
          setContent(post.content.rendered);

          if (post.featured_media) {
            try {
              const mediaResponse = await fetch(
                `https://docs.aarnalaw.com/wp-json/wp/v2/media/${post.featured_media}`,
              );
              const mediaResult = await mediaResponse.json();
              setFeatureImage(mediaResult.source_url || null);
            } catch (error) {
              console.error("Error fetching media for post:", error);
              setFeatureImage(null);
            }
          }
        } else {
          console.error("No post data found.");
          setError(true); // Set error state if no post found
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [paramUrl]);

  const formatDateString = (dateString) => {
    const date = new Date(dateString);
    const monthAbbreviations = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];
    const day = date.getDate();
    const month = monthAbbreviations[date.getMonth()];
    const year = date.getFullYear();
    return `${day}\n${month}\n${year}`;
  };

  // If error, show the error page
  if (error) {
    return <ErrorPage />;
  }

  return (
    <>
      <style>
      {`
  .insight-blog ul {
    list-style-type: disc; /* Show dots for unordered lists */
    margin-left: 30px; /* Indentation for unordered list */
  }

  .insight-blog ol {
    list-style-type: decimal; /* Show numbers for ordered lists */
    margin-left: 30px; /* Indentation for ordered list */
  }

  .insight-blog li {
    margin-bottom: 0px; /* Optional: space between list items */
  }
  `}
      </style>

      <div className="mx-auto w-11/12">
        <div className="h-[20vh]"></div>
        <h1
          className="py-4 text-4xl font-bold tracking-wide text-black"
          dangerouslySetInnerHTML={{ __html: title }}
        ></h1>
        <p className="py-4">Published: {formatDateString(date)}</p>
        <Banner backgroundImage={featureImage} />
      </div>

      <div className="py-5">
  <div className="mx-auto w-11/12">
    {/* Render the content with HTML tags (like <ul>, <ol>, <li>) */}
    <div
      dangerouslySetInnerHTML={{ __html: content }}
      className="insight-blog"
    />
  </div>
</div>

      <div className="mx-auto w-11/12">
        <Link
          className="mt-6 bg-custom-red px-4 py-2 text-white"
          href="/insights/"
        >
          Back to Insights
        </Link>
      </div>
    </>
  );
}
