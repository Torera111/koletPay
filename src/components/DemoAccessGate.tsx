"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useDemoSession } from "@/lib/demo-session";
import { useAuth } from "@/lib/auth";

/**
 * Prevent accidental access to the demo workspace before choosing preview mode.
 * This is a UX gate, NOT a security boundary. Backend auth is still required.
 */
export function DemoAccessGate({ children }: { children: ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const { ready, identity } = useDemoSession();
  const { loading, user } = useAuth();
  const demoAllowed = process.env.NEXT_PUBLIC_ENABLE_DEMO_MODE === "true";

  useEffect(() => {
    if (!loading && !user && !(demoAllowed && identity) && path !== "/" &&
        path !== "/login" && !path.startsWith("/login/") &&
        path !== "/register" && !path.startsWith("/register/")) {
      router.replace("/login");
    }
  }, [demoAllowed, identity, loading, path, router, user]);

  // The root route redirects to /login. Authentication screens stay public.
  if (
    path === "/" ||
    path === "/login" ||
    path.startsWith("/login/") ||
    path === "/register" ||
    path.startsWith("/register/")
  ) {
    return <>{children}</>;
  }

  if (loading || !ready) {
    return (
      <main className="main" role="status">
        <p>Opening KoletPay preview…</p>
      </main>
    );
  }

  if (!user && !(demoAllowed && identity)) {
    return (
      <main className="main" style={{ maxWidth: 640, paddingTop: 80 }}>
        <section className="card">
          <span className="eyebrow">Demo workspace</span>
          <h1 style={{ fontSize: 28, margin: "10px 0" }}>Open the KoletPay demo</h1>
          <p style={{ marginBottom: 22 }}>
            Your session is not active. Sign in to continue, or use the preview
            workspace when demo mode is enabled for this environment.
          </p>
          <Link href="/login" className="btn blue">
            Go to demo access
          </Link>
        </section>
      </main>
    );
  }

  return <>{children}</>;
}
