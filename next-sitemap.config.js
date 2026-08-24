const fs = require("fs");
const path = require("path");

const siteUrl = "https://lasu.online";
const defaultLocale = "en";

const locales = fs
  .readdirSync(path.join(__dirname, "messages"))
  .filter((f) => f.endsWith(".json"))
  .map((f) => f.replace(/\.json$/, ""));

const localePattern = new RegExp(`^/(${locales.join("|")})(?=/|$)`);

function stripLocale(loc) {
  const pathname = new URL(loc, siteUrl).pathname;
  return pathname.replace(localePattern, "") || "/";
}

function localeOf(loc) {
  const match = new URL(loc, siteUrl).pathname.match(localePattern);
  return match ? match[1] : defaultLocale;
}

function href(locale, route) {
  const clean = route === "/" ? "" : route;
  return locale === defaultLocale
    ? `${siteUrl}${clean || "/"}`
    : `${siteUrl}/${locale}${clean}`;
}

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  exclude: [
    "/dashboard/profile",
    "/*/dashboard/profile",
    "/dashboard/welcome",
    "/*/dashboard/welcome",
    "/api/*",
    "/icon.svg",
    "/apple-icon.png",
    "/favicon.ico",
    "/manifest.webmanifest",
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard/profile", "/dashboard/welcome"],
      },
    ],
  },
  transform: async (config, loc) => {
    const route = stripLocale(loc);
    const locale = localeOf(loc);

    return {
      loc: href(locale, route),
      changefreq: config.changefreq,
      priority: /^\/(dashboard)?$/.test(route) ? 1 : config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: [
        ...locales.map((locale) => ({
          href: href(locale, route),
          hreflang: locale,
          hrefIsAbsolute: true,
        })),
        {
          href: href(defaultLocale, route),
          hreflang: "x-default",
          hrefIsAbsolute: true,
        },
      ],
    };
  },
};
