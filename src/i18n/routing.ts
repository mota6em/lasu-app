import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";
import { defaultLocale, locales } from "./locales";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
  localeCookie: {
    name: "LASU_LOCALE",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  },
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
