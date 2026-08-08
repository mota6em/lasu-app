const siteUrl = "https://lasu.online";

/**
 * hreflang is emitted as <link> tags from each page's `alternates` metadata,
 * which next-sitemap cannot express correctly here: it treats alternateRefs
 * hrefs as site roots and re-appends the path, producing /privacy/ar/privacy.
 * Google accepts either signal, so the sitemap just lists the URLs.
 */
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  exclude: [
    "/dashboard/profile",
    "/*/dashboard/profile",
    "/dashboard/welcome",
    "/*/dashboard/welcome",
    // english is served unprefixed, so /en/* would duplicate every page
    "/en",
    "/en/*",
  ],
  transform: async (config, loc) => ({
    loc,
    changefreq: config.changefreq,
    priority: /^\/(dashboard)?$/.test(loc) ? 1 : config.priority,
    lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
  }),
};
