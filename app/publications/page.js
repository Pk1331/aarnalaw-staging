// app/publications/page.js

import PublicationsClient from "./PublicationsClient";
import config from "../../config.json";
import { headers } from "next/headers";

// Enable ISR (revalidate every 60 seconds)
export const revalidate = 60;

export const metadata = {
  title: "Legal Publications and Research",
  description:
    "Access a comprehensive collection of legal publications and research papers authored by Aarna Law's experts. Stay up-to-date with cutting-edge legal scholarship.",
  metadataBase: new URL("https://www.aarnalaw.com"),
  alternates: {
    canonical: "/publications",
  },
  openGraph: {
    title: "Legal Publications and Research",
    description:
      "Access a comprehensive collection of legal publications and research papers authored by Aarna Law's experts. Stay up-to-date with cutting-edge legal scholarship.",
    url: "https://www.aarnalaw.com/publications",
    images: "/insights/InsightsBanner.jpg",
  },
};

// Utility to determine productionMode from domain
function getProductionModeFromHost(hostname) {
  const isLiveDomain =
    hostname === config.LIVE_SITE_URL || hostname === config.LIVE_SITE_URL_WWW;

  return isLiveDomain
    ? config.LIVE_PRODUCTION_SERVER_ID
    : config.STAG_PRODUCTION_SERVER_ID;
}

// Fetch publications using correct production mode
async function fetchInitialPublications(productionMode) {
  if (!productionMode) return [];

  try {
    const url = `${config.SERVER_URL}publications?_embed&status[]=publish&production_mode[]=${productionMode}`;

    const res = await fetch(url, {
      next: { revalidate: 60 },
    });

    const data = await res.json();
    return data.sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (error) {
    console.error("Publications fetch error:", error);
    return [];
  }
}

export default async function AarnaPublicationsPage() {
  const headersList = headers();
  const hostname = headersList.get("host")?.replace(/^www\./, "") ?? "";
  const productionMode = getProductionModeFromHost(hostname);

  const initialData = await fetchInitialPublications(productionMode);

  return <PublicationsClient initialData={initialData} />;
}
