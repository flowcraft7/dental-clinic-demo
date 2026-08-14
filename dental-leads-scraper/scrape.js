import { ApifyClient } from "apify-client";
import fetch from "node-fetch";
import fs from "fs";
import "dotenv/config";

const client = new ApifyClient({ token: process.env.APIFY_API_TOKEN });

const CITIES = [
  "New York, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX",
  "Phoenix, AZ", "Philadelphia, PA", "San Antonio, TX", "San Diego, CA",
  "Dallas, TX", "Jacksonville, FL", "Columbus, OH", "San Francisco, CA",
  "Seattle, WA", "Denver, CO", "Boston, MA", "Nashville, TN",
  "Detroit, MI", "Portland, OR", "Memphis, TN", "Atlanta, GA",
];

async function auditWebsite(url) {
  if (!url) {
    return { hasWebsite: "No", pitchNote: "No website found — strong opening: offer to build one." };
  }
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    const html = (await res.text()).toLowerCase();

    const hasViewportMeta = html.includes('name="viewport"');
    const hasBookingWords = /book now|schedule appointment|book appointment|book online/.test(html);
    const hasChat = /chat|livechat|intercom|drift|tawk/.test(html);
    const isHttps = url.startsWith("https://");

    const gaps = [];
    if (!hasViewportMeta) gaps.push("not mobile-responsive");
    if (!hasBookingWords) gaps.push("no online booking");
    if (!hasChat) gaps.push("no chat/AI assistant");
    if (!isHttps) gaps.push("no SSL");

    return {
      hasWebsite: "Yes",
      pitchNote: gaps.length
        ? `Website exists but: ${gaps.join(", ")}.`
        : "Website looks solid — pitch on speed/animations/AI receptionist instead.",
    };
  } catch {
    return { hasWebsite: "Yes (unreachable)", pitchNote: "Website URL found but didn't load — good opening line." };
  }
}

async function run() {
  console.log("Starting Apify run... this can take a few minutes.");

  const apifyRun = await client.actor("compass/crawler-google-places").call({
    searchStringsArray: CITIES.map((c) => `dentist in ${c}`),
    maxCrawledPlacesPerSearch: 20,
    language: "en",
  });

  const { items } = await client.dataset(apifyRun.defaultDatasetId).listItems();

  const seen = new Set();
  const unique = items.filter((i) => {
    if (!i.phone || seen.has(i.phone)) return false;
    seen.add(i.phone);
    return true;
  });

  console.log(`Found ${unique.length} unique clinics. Now auditing websites...`);

  const enriched = [];
  for (const item of unique) {
    console.log(`Checking: ${item.title}`);
    const audit = await auditWebsite(item.website);
    enriched.push({ ...item, ...audit });
  }

  const header = "Name,Phone,Address,Website,HasWebsite,PitchNote,Rating,Reviews,City\n";
  const rows = enriched
    .map((i) =>
      [
        i.title,
        i.phone,
        i.address,
        i.website || "",
        i.hasWebsite,
        i.pitchNote,
        i.totalScore,
        i.reviewsCount,
        i.city || "",
      ]
        .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
        .join(",")
    )
    .join("\n");

  fs.writeFileSync("dental_leads.csv", header + rows);
  console.log(`Done. ${enriched.length} leads saved to dental_leads.csv with website audit.`);
}

run();