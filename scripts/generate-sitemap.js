import fs from "fs";

const baseUrl = "https://movlix.zg0ul.com"; // Replace with your actual domain when deployed

const staticPages = ["", "/trending", "/search"];

function generateSitemap() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages
    .map(
      (page) => `
  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${page === "" ? "1.0" : "0.8"}</priority>
  </url>`,
    )
    .join("")}
</urlset>`;

  fs.writeFileSync("./public/sitemap.xml", sitemap);
  console.log("Sitemap generated successfully!");
}

generateSitemap();
