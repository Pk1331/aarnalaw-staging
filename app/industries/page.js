// app/industries/page.js

import React from "react";
import Banner from "@/components/Industries/Banner";
import Industries from "@/components/Industries/IndustryLists";
import config from "@/config.json";
import { headers } from "next/headers";

export const revalidate = 60;

export const metadata = {
  title: "Industry-Specific Legal Solutions | Aarna Law",
  description:
    "We offer tailored legal services for diverse industries, addressing unique needs across sectors with specialized expertise.",
  metadataBase: new URL("https://www.aarnalaw.com"),
  alternates: {
    canonical: "/industries",
  },
  openGraph: {
    title: "Industry-Specific Legal Solutions | Aarna Law",
    description:
      "We offer tailored legal services for diverse industries, addressing unique needs across sectors with specialized expertise.",
    url: "https://www.aarnalaw.com/industries",
    images: "/Industries/IndutriesBanner.jpg",
  },
};

// Utility to determine productionMode based on domain
function getProductionModeFromHost(hostname) {
  const isLiveDomain =
    hostname === config.LIVE_SITE_URL || hostname === config.LIVE_SITE_URL_WWW;

  return isLiveDomain
    ? config.LIVE_PRODUCTION_SERVER_ID
    : config.STAG_PRODUCTION_SERVER_ID;
}

// Fetch industries based on production mode
async function getIndustries(productionMode) {
  if (!productionMode) return [];

  try {
    const url = `${config.SERVER_URL}industries?_embed&status[]=publish&production_mode[]=${productionMode}&per_page=100`;

    const res = await fetch(url, {
      next: { revalidate: 60 },
    });

    const data = await res.json();

    return data.sort((a, b) =>
      a.title.rendered.localeCompare(b.title.rendered)
    );
  } catch (error) {
    console.error("Industries fetch error:", error);
    return [];
  }
}

export default async function IndustriesPage() {
  const headersList = headers();
  const hostname = headersList.get("host")?.replace(/^www\./, "") ?? "";
  const productionMode = getProductionModeFromHost(hostname);

  const industries = await getIndustries(productionMode);

  return (
    <>
      <Banner />
      <Industries data={industries} loading={false} />
    </>
  );
}
