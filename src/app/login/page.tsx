"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { useKoletPay } from "@/lib/store";
import { useDemoSession } from "@/lib/demo-session";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const { data, ready } = useKoletPay();
  const { enterDemo } = useDemoSession();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const preview = () => {
    enterDemo({
      displayName: "Demo merchant",
      businessName: data.business.name,
      email: "",
    });
    router.replace("/dashboard");
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice("");
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      router.replace("/dashboard");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Unable to sign in.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <div className="auth-visual-inner">
          <Link href="/login" className="auth-brand">
            <span className="brand-symbol">K</span>
            <span>KoletPay</span>
          </Link>
          <div className="auth-copy">
            <span className="auth-kicker">Business made simpler</span>
            <h1>Your business, right where you left it.</h1>
            <p>
              Manage invoices, payments, customers, and reports in one
              organized web workspace.
            </p>
          </div>
          <div className="auth-proof">
            <div className="auth-proof-card">
              <span>Invoices</span>
              <strong>Create and track invoices</strong>
              <small>Know what has been paid and what is outstanding.</small>
            </div>
            <div className="auth-proof-card">
              <span>Customers</span>
              <strong>Keep customers organized</strong>
              <small>See each customer's orders and payment history.</small>
            </div>
          </div>
        </div>
      </section>

      <section className="auth-form-panel">
        <div className="auth-form-wrap">
          <div className="auth-mobile-brand">
            <Link href="/login" className="auth-brand">
              <span className="brand-symbol">K</span>
              <span>KoletPay</span>
            </Link>
          </div>
          <div className="auth-heading">
            <span className="eyebrow">Merchant sign in</span>
            <h2>Welcome back</h2>
            <p>Sign in to your secure KoletPay business workspace.</p>
          </div>

          <div className="note" style={{ marginBottom: 18 }}>
            <LockKeyhole size={17} style={{ marginRight: 7, verticalAlign: "middle" }} />
            Sessions expire automatically and are protected by an HttpOnly cookie.
          </div>

          <form className="auth-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label className="label" htmlFor="login-email">Email</label>
              <input id="login-email" className="field" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </div>
            <div className="form-group">
              <label className="label" htmlFor="login-password">Password</label>
              <input id="login-password" className="field" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} />
            </div>
            <button type="submit" disabled={submitting} className="btn blue auth-submit">
              {submitting ? "Signing in..." : "Sign in"} <ArrowRight size={17} />
            </button>
            {notice && <p role="alert" className="auth-message">{notice}</p>}
          </form>

          <p className="small" style={{ marginTop: 14 }}>
            Your business records are scoped to your authenticated merchant account.
          </p>

          {process.env.NEXT_PUBLIC_ENABLE_DEMO_MODE === "true" && (
            <>
              <div className="divider" />
              <button type="button" onClick={preview} disabled={!ready} className="btn block">
                Open local demo workspace
              </button>
              <p className="small" style={{ marginTop: 8 }}>Demo mode is enabled for this environment; it is not account authentication.</p>
            </>
          )}
          <p className="auth-footer">
            Want to try setup? <Link href="/register">Create a demo workspace</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
