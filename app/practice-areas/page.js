// app/practice-area/page.js

import Banner from "@/components/PracticeArea/Banner";
import PracticeLists from "@/components/PracticeArea/PracticeLists";
import config from "@/config.json";
import { headers } from "next/headers";

export const revalidate = 60;

export const metadata = {
  title: "India's leading law firm offering legal counsel in practice areas",
  description:
    "We offer legal services for a range of practice areas including corporate advisory, arbitration, mediation, litigation, IP, risk assessment, and compliance",
  metadataBase: new URL("https://www.aarnalaw.com"),
  alternates: {
    canonical: "/practice-area",
  },
  openGraph: {
    title: "India's leading law firm offering legal counsel in practice areas",
    description:
      "We offer legal services for a range of practice areas including corporate advisory, arbitration, mediation, litigation, IP, risk assessment, and compliance",
    url: "https://www.aarnalaw.com/practice-area",
    images: "/PracticeArea/PracticeAreas.png",
  },
};

const cityToCategoryId = {
  Bengaluru: 482,
  Mumbai: 483,
  Delhi: 484,
  Bangalore: 482,
  // Add more cities and their category IDs here
};

function getProductionModeFromHost(hostname) {
  const isLiveDomain =
    hostname === config.LIVE_SITE_URL || hostname === config.LIVE_SITE_URL_WWW;
  return isLiveDomain
    ? config.LIVE_PRODUCTION_SERVER_ID
    : config.STAG_PRODUCTION_SERVER_ID;
}

function getCookieFromHeader(cookieHeader, name) {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

async function getPracticeAreas(productionMode, city, page = 1, perPage = 13) {
  console.log("Fetching practice areas for city:", city);
  let categoryId = cityToCategoryId[city] || null;
  let url = `${config.SERVER_URL}practice-areas?status[]=publish&production_mode[]=${productionMode}&per_page=${perPage}&page=${page}`;
  if (categoryId) {
    url += `&categories=${categoryId}`;
  }

  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    const data = await res.json();

    if (Array.isArray(data) && data.length === 0 && categoryId) {
      // Fallback to all blogs if no results for city
      const fallbackUrl = `${config.SERVER_URL}practice-areas?status[]=publish&production_mode[]=${productionMode}&per_page=${perPage}&page=${page}`;
      const fallbackRes = await fetch(fallbackUrl, {
        next: { revalidate: 60 },
      });
      const fallbackData = await fallbackRes.json();
      return fallbackData.sort((a, b) =>
        a.title.rendered.localeCompare(b.title.rendered),
      );
    }

    return data.sort((a, b) =>
      a.title.rendered.localeCompare(b.title.rendered),
    );
  } catch (err) {
    console.error("Error fetching practice areas:", err);
    return [];
  }
}

export default async function PracticeAreaPage() {
  const headersList = headers();
  const hostname = headersList.get("host")?.replace(/^www\./, "") ?? "";
  const cookieHeader = headersList.get("cookie") || "";
  const cityFromCookie =
    getCookieFromHeader(cookieHeader, "userCity") || "Unknown";
  const productionMode = getProductionModeFromHost(hostname);

  // let cityFromIP = "Unknown";
  // try {
  //   const ipRes = await fetch(
  //     "https://api.ipgeolocation.io/ipgeo?apiKey=c14f0708410d42f7b0fe925e2c5a4457",
  //   );
  //   const ipData = await ipRes.json();
  //   console.log("IP Geolocation Data:", ipData);
  //   cityFromIP = ipData.city || "Unknown";
  //   console.log("City from IP:", cityFromIP);
  // } catch (e) {
  //   cityFromIP = "Unknown";
  // }
  // const practiceAreas = await getPracticeAreas(productionMode, cityFromIP);
  const practiceAreas = await getPracticeAreas(productionMode, cityFromCookie);

  return (
    <>
      <Banner />
      <PracticeLists data={practiceAreas} loading={false} />
    </>
  );
}
