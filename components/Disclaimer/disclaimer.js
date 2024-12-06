import React, { useEffect, useState } from "react";

const Disclaimer = () => {
  const [page, setPage] = useState(null); // State to store page data
  const [error, setError] = useState(null); // State to handle errors

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await fetch(
          "https://docs.aarnalaw.com/wp-json/wp/v2/pages/1505",
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

  if (!page) {
    return <div className="text-center">Loading...</div>; // Show a loading state while fetching data
  }

  return (
    <>
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
      <div className="flex items-center justify-center pt-16">
        <div className="w-11/12 ">
          <div
            dangerouslySetInnerHTML={{ __html: page.content.rendered }}
          ></div>
        </div>
      </div>
    </>
  );
};

export default Disclaimer;
//terms-of-use