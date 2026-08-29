"use client";

import { useCallback, useState } from "react";
import { useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { BillingStatus } from "@/types/billing";
import type { PlanId } from "@/lib/plans";

export const BILLING_KEY = ["billing-status"];

async function readStatus(): Promise<BillingStatus> {
  const res = await fetch("/api/billing/status", { credentials: "include" });
  if (!res.ok) throw new Error(`billing status responded ${res.status}`);
  return res.json();
}

export function useBilling() {
  const { status: authStatus } = useSession();

  const query = useQuery({
    queryKey: BILLING_KEY,
    queryFn: readStatus,
    enabled: authStatus !== "loading",
    staleTime: 60_000,
    refetchOnWindowFocus: true,
    retry: 1,
  });

  return {
    status: query.data,
    tier: query.data?.tier ?? "free",
    isPro: query.data?.tier === "pro",
    quota: query.data?.quota,
    entitlement: query.data?.entitlement,
    plans: query.data?.plans,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}

type CheckoutOptions = { source?: "web" | "extension"; returnTo?: string };

export function useBillingActions() {
  const locale = useLocale();
  const queryClient = useQueryClient();
  const [pending, setPending] = useState<PlanId | "portal" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const post = useCallback(async (path: string, body: unknown) => {
    const res = await fetch(path, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const payload = await res.json().catch(() => null);
    return { res, payload } as { res: Response; payload: Record<string, unknown> | null };
  }, []);

  const openPortal = useCallback(
    async (intent?: "cancel" | "update" | "payment_method") => {
      setPending("portal");
      setError(null);
      try {
        const { res, payload } = await post("/api/billing/portal", { locale, intent });
        if (res.ok && typeof payload?.url === "string") {
          window.location.href = payload.url;
          return true;
        }
        setError(typeof payload?.error === "string" ? payload.error : "portal_failed");
        return false;
      } catch {
        setError("network");
        return false;
      } finally {
        setPending(null);
      }
    },
    [locale, post],
  );

  const checkout = useCallback(
    async (plan: PlanId, options: CheckoutOptions = {}) => {
      setPending(plan);
      setError(null);
      try {
        const { res, payload } = await post("/api/billing/checkout", {
          plan,
          locale,
          source: options.source ?? "web",
          returnTo: options.returnTo,
        });

        if (res.ok && typeof payload?.url === "string") {
          window.location.href = payload.url;
          return true;
        }

        if (res.status === 409 && payload?.error === "already_subscribed") {
          await queryClient.invalidateQueries({ queryKey: BILLING_KEY });
          return openPortal("update");
        }

        if (res.status === 409 && payload?.error === "already_lifetime") {
          await queryClient.invalidateQueries({ queryKey: BILLING_KEY });
          setError("already_lifetime");
          return false;
        }

        if (res.status === 401) {
          setError("login_required");
          return false;
        }

        setError(typeof payload?.error === "string" ? payload.error : "checkout_failed");
        return false;
      } catch {
        setError("network");
        return false;
      } finally {
        setPending(null);
      }
    },
    [locale, post, openPortal, queryClient],
  );

  const sync = useCallback(
    async (sessionId?: string | null) => {
      try {
        const { res, payload } = await post("/api/billing/sync", {
          sessionId: sessionId || undefined,
        });
        if (res.ok && payload) {
          queryClient.setQueryData(BILLING_KEY, payload as unknown as BillingStatus);
          return payload as unknown as BillingStatus;
        }
      } catch {}
      await queryClient.invalidateQueries({ queryKey: BILLING_KEY });
      return null;
    },
    [post, queryClient],
  );

  return { checkout, openPortal, sync, pending, error, setError };
}
