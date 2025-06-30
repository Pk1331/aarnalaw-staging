export async function generateMetadata({ params }) {
  const { slug } = params;

  const res = await fetch(
    `https://docs.aarnalaw.com/wp-json/wp/v2/posts?_embed&slug=${slug}`
  );
  const data = await res.json();

  if (!data || data.length === 0) {
    return {
      title: "Blog Not Found | Aarna Law",
      description: "The blog you are looking for is not available.",
      metadataBase: new URL("https://www.aarnalaw.com/aarna-news/"),
    };
  }

  const blog = data[0];

  // Get the featured image URL safely
  const imageUrl = blog._embedded?.["wp:featuredmedia"]?.[0]?.source_url?.startsWith("http")
    ? blog._embedded["wp:featuredmedia"][0].source_url
    : `https://docs.aarnalaw.com${blog._embedded["wp:featuredmedia"][0].source_url}`;

  return {
    title: blog.acf?.meta_title || blog.title.rendered,
    description: blog.acf?.meta_description || "Read more about this topic.",
    metadataBase: new URL("https://www.aarnalaw.com/aarna-news/"),
    openGraph: {
      title: blog.acf?.meta_title || blog.title.rendered,
      description: blog.acf?.meta_description || "Read more about this topic.",
      url: `https://www.aarnalaw.com/insights/${slug}`,
      type: "article",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: blog.title.rendered,
        },
      ],
    },
  };
}

// ✅ Default export - A React component (needed for Next.js to work)
export default function InsightPostLayout({ children }) {
  return <>{children}</>;
}
