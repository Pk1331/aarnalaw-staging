import LandingPage from "@/components/Industries/InsidePage/LandingPage";

export const metadata = {
  title: "Industries - Aarna Law",
  description: "Explore our industry-specific legal expertise at Aarna Law. We provide specialized legal services across various industry sectors.",
  metadataBase: new URL("https://www.aarnalaw.com"),
  alternates: {
    canonical: "/industries",
  },
  openGraph: {
    title: "Industries - Aarna Law",
    description: "Explore our industry-specific legal expertise at Aarna Law. We provide specialized legal services across various industry sectors.",
    url: "/industries",
    images: "/PracticeArea/PracticeAreas.png",
  },
};

async function fetchIndustries() {
  try {
    const response = await fetch(
      `https://docs.aarnalaw.com/wp-json/wp/v2/industries?_embed&per_page=100`,
      { next: { revalidate: 3600 } }
    );
    if (!response.ok) {
      throw new Error('Failed to fetch industries');
    }
    const result = await response.json();
    return Array.isArray(result)
      ? result.sort((a, b) => a.title.rendered.localeCompare(b.title.rendered))
      : [];
  } catch (error) {
    console.error("Error fetching industries:", error);
    return [];
  }
}

async function fetchIndustryDetails(slug) {
  try {
    const response = await fetch(
      `https://docs.aarnalaw.com/wp-json/wp/v2/industries?_embed&slug=${slug}`,
      { next: { revalidate: 3600 } }
    );
    if (!response.ok) {
      throw new Error('Failed to fetch industry details');
    }
    const result = await response.json();
    return Array.isArray(result) && result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("Error fetching industry details:", error);
    return null;
  }
}

export default async function IndustryPage({ params }) {
  const [initialData, industryDetails] = await Promise.all([
    fetchIndustries(),
    fetchIndustryDetails(params.slug)
  ]);

  return <LandingPage
    slug={params.slug}
    initialData={initialData}
    initialIndustry={industryDetails}
  />;
}
