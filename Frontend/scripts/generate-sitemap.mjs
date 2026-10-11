
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "vite";

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);

const env = loadEnv("production", root, "");
const API = env.VITE_API_URL?.replace(/\/+$/, "");
const SITE = "https://ravi-graphics.vercel.app";

if (!API) {
  throw new Error("VITE_API_URL is missing from Frontend/.env");
}

const staticRoutes = [
  { path: "/", freq: "weekly", priority: "1.0" },
  { path: "/services", freq: "weekly", priority: "0.9" },
  { path: "/about", freq: "monthly", priority: "0.8" },
  { path: "/contact", freq: "monthly", priority: "0.7" },
  { path: "/quote", freq: "monthly", priority: "0.8" },
  { path: "/privacy-policy" },
  { path: "/terms-conditions" },
  { path: "/shipping-policy" },
  { path: "/return-policy" },
];

const escapeXml = (value) =>
  String(value).replace(/[<>&'"]/g, (char) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&apos;",
    '"': "&quot;",
  })[char]);

const routes = [...staticRoutes];

const response = await fetch(`${API}/api/services`, {
  signal: AbortSignal.timeout(30000),
});

if (!response.ok) {
  throw new Error(`Services API returned HTTP ${response.status}`);
}

const categories = await response.json();

if (!Array.isArray(categories)) {
  throw new Error("Services API did not return an array");
}

for (const category of categories) {
  if (!category.slug) continue;

  routes.push({
    path: `/services/${category.slug}`,
    freq: "monthly",
    priority: "0.8",
  });

  for (const product of category.services ?? []) {
    if (!product.slug) continue;

    routes.push({
      path: `/services/${category.slug}/${product.slug}`,
      freq: "monthly",
      priority: "0.7",
    });
  }
}

const uniqueRoutes = [
  ...new Map(routes.map((route) => [route.path, route])).values(),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${uniqueRoutes.map((route) => `  <url>
    <loc>${escapeXml(SITE + route.path)}</loc>
    ${route.freq ? `<changefreq>${route.freq}</changefreq>` : ""}
    ${route.priority ? `<priority>${route.priority}</priority>` : ""}
  </url>`).join("\n")}
</urlset>
`;

const publicDir = path.join(root, "public");
await mkdir(publicDir, { recursive: true });
await writeFile(path.join(publicDir, "sitemap.xml"), xml, "utf8");

console.log(`Generated sitemap with ${uniqueRoutes.length} URLs.`);