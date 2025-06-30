import React, { useEffect, useState } from "react";
import { optimizeHTMLContent } from "../../utils/contentOptimizer";

const Disclaimer = () => {
  const [page, setPage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await fetch(
          "https://docs.aarnalaw.com/wp-json/wp/v2/pages/1505"
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
            list-style-type: decimal;
            margin: 1rem 0;
            padding-left: 2rem;
          }
          li {
            margin-bottom: 0.5rem;
            line-height: 1.5;
          }
        `}
      </style>
      
      <div className="w-11/12 mx-auto">
        {page ? (
          <article
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ 
              __html: optimizeHTMLContent(page.content.rendered) 
            }}
          />
        ) : (
          <div className="w-full h-64 bg-gray-200 rounded-md animate-pulse" />
        )}
      </div>
    </main>
  );
};

export default Disclaimer;
