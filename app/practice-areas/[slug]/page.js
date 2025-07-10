import LandingPage from "@/components/PracticeArea/InsidePage/LandingPage";
import { notFound } from "next/navigation"; // <-- ✅ Required import

// export const metadata = {
//   title: "Practice Areas - Aarna Law",
//   description: "Explore our diverse legal practice areas at Aarna Law. We offer expert legal services across various domains with a focus on excellence and client satisfaction.",
//   metadataBase: new URL("https://www.aarnalaw.com"),
//   alternates: {
//     canonical: "/practice-areas",
//   },
//   openGraph: {
//     title: "Practice Areas - Aarna Law",
//     description: "Explore our diverse legal practice areas at Aarna Law. We offer expert legal services across various domains with a focus on excellence and client satisfaction.",
//     url: "/practice-areas",
//     images: "/PracticeArea/PracticeAreas.png",
//   },
// };

async function fetchPracticeAreas() {
  try {
    const response = await fetch(
      `https://docs.aarnalaw.com/wp-json/wp/v2/practice-areas?_embed&per_page=100`,
      { cache: "no-store" }
    );
    if (!response.ok) {
      throw new Error('Failed to fetch practice areas');
    }
    const result = await response.json();
    return Array.isArray(result)
      ? result.sort((a, b) => a.title.rendered.localeCompare(b.title.rendered))
      : [];
  } catch (error) {
    console.error("Error fetching practice areas:", error);
    return [];
  }
}

async function fetchPracticeAreaDetails(slug) {
  try {
    const response = await fetch(
      `https://docs.aarnalaw.com/wp-json/wp/v2/practice-areas?_embed&slug=${slug}`,
      { cache: "no-store" }
    );
    if (!response.ok) {
      throw new Error('Failed to fetch practice area details');
    }
    const result = await response.json();
    return Array.isArray(result) && result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("Error fetching practice area details:", error);
    return null;
  }
}

export default async function PracticeAreaPage({ params }) {
  const [initialData, practiceAreaDetails] = await Promise.all([
    fetchPracticeAreas(),
    fetchPracticeAreaDetails(params.slug)
  ]);
  if (!practiceAreaDetails) {
    return notFound();
  }
  return <LandingPage
    slug={params.slug}
    initialData={initialData}
    initialPracticeArea={practiceAreaDetails}
  />;
}
