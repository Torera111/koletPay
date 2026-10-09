"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowRight, Mail, Phone, UserRound, ShieldAlert } from "lucide-react";
import { useKoletPay } from "@/lib/store";
import { useDemoSession } from "@/lib/demo-session";
import { useAuth } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const { data, ready, updateBusiness } = useKoletPay();
  const { enterDemo } = useDemoSession();
  const { register } = useAuth();
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const displayName = String(form.get("fullName") || "").trim();
    const businessName = String(form.get("businessName") || "").trim();
    const email = String(form.get("email") || "").trim();
    const phone = String(form.get("phone") || "").trim();
    const password = String(form.get("password") || "");

    if (!ready) {
      setNotice("The demo workspace is still loading.");
      return;
    }
    if (!displayName || !businessName || !email || !phone || password.length < 8) {
      setNotice("Complete all fields and use a password with at least 8 characters.");
      return;
    }

    setSubmitting(true);
    void register({ name: displayName, email, phoneNumber: phone, password })
      .then(() => {
        updateBusiness({ ...data.business, name: businessName, email, phone });
        router.replace("/dashboard");
      })
      .catch((error) => setNotice(error instanceof Error ? error.message : "Unable to create the account."))
      .finally(() => setSubmitting(false));
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
            <span className="auth-kicker">Simpler business records</span>
            <h1>Organize your business from day one.</h1>
            <p>Create invoices, track what customers owe, and keep your finances in view.</p>
          </div>
          <div className="auth-proof">
            <div className="auth-proof-card">
              <span>Invoices</span>
              <strong>Stay on top of payments</strong>
              <small>Create invoices and track outstanding balances.</small>
            </div>
            <div className="auth-proof-card">
              <span>Reports</span>
              <strong>Make clearer decisions</strong>
              <small>See income trends and popular services.</small>
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
            <span className="eyebrow">Merchant registration</span>
            <h2>Create your workspace</h2>
            <p>Register a secure merchant account for your business.</p>
          </div>
          <div className="note" style={{ marginBottom: 16 }}>
            <ShieldAlert size={17} style={{ verticalAlign: "middle", marginRight: 7 }} />
            Passwords are hashed on the server and never returned to the browser.
          </div>
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field-grid">
              <div className="form-group">
                <label className="label" htmlFor="fullName">Full name</label>
                <div className="auth-input">
                  <UserRound size={17} />
                  <input id="fullName" name="fullName" autoComplete="off"
                    placeholder="e.g. Ada Demo" maxLength={80} required />
                </div>
              </div>
              <div className="form-group">
                <label className="label" htmlFor="password">Password</label>
                <div className="auth-input">
                  <ShieldAlert size={17} />
                  <input id="password" name="password" type="password" autoComplete="new-password"
                    placeholder="At least 8 characters" minLength={8} required />
                </div>
              </div>
              <div className="form-group">
                <label className="label" htmlFor="businessName">Business name</label>
                <div className="auth-input">
                  <span className="auth-input-letter">K</span>
                  <input id="businessName" name="businessName" autoComplete="off"
                    placeholder="e.g. Ada's Studio" maxLength={100} required />
                </div>
              </div>
              <div className="form-group">
                <label className="label" htmlFor="email">Sample email address</label>
                <div className="auth-input">
                  <Mail size={17} />
                  <input id="email" name="email" type="email" autoComplete="off"
                    placeholder="demo@example.com" maxLength={120} required />
                </div>
              </div>
              <div className="form-group">
                <label className="label" htmlFor="phone">Sample phone number</label>
                <div className="auth-input">
                  <Phone size={17} />
                  <input id="phone" name="phone" type="tel" autoComplete="off"
                    placeholder="+234 800 000 0000" maxLength={30} required />
                </div>
              </div>
            </div>
            <button type="submit" disabled={!ready || submitting} className="btn blue auth-submit">
              {submitting ? "Creating account..." : "Create account"} <ArrowRight size={16} />
            </button>
            {notice && <p role="alert" className="auth-message">{notice}</p>}
          </form>
          <p className="small" style={{ marginTop: 12 }}>
            Business details and invoices are saved by the existing browser demo
            store and may remain after you exit the preview. Avoid real information.
          </p>
          <p className="auth-footer">
            Already exploring? <Link href="/login">Back to demo access</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
