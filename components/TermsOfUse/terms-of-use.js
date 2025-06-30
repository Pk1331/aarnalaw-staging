import React, { useEffect, useState } from "react";
// import { optimizeHTMLContent } from "../../utils/contentOptimizer";

const TermsOfUse = () => {
  const [page, setPage] = useState(null); // State to store page data
  const [error, setError] = useState(null); // State to handle errors

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await fetch(
          "https://docs.aarnalaw.com/wp-json/wp/v2/pages/1500"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPage(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPage();
  }, []);

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <main className="pt-16">
      <style>
        {`
          ol {
            list-style-type: decimal; /* Ensures numbers appear */
            margin: 1rem 0;
            padding-left: 2rem;
          }
          li {
            margin-bottom: 0.5rem;
            line-height: 1.5;
          }
        `}
      </style>
      {/* Center the entire content */}
      <div className="w-11/12 mx-auto p-4">
        {page ? (
          <article
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ 
              // WARNING: This is raw HTML from the CMS. Previously optimized with optimizeHTMLContent.
              __html: page.content.rendered 
            }}
          />
        ) : (
          <div className="w-full h-64 bg-gray-200 rounded-md animate-pulse" />
        )}
      </div>
    </main>
  );
};

export default TermsOfUse;
