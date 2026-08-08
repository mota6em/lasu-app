const siteUrl = "https://lasu.online";

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  exclude: [
    "/dashboard/profile",
    "/*/dashboard/profile",
    "/dashboard/welcome",
    "/*/dashboard/welcome",
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
