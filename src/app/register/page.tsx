'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  UserRound,
} from 'lucide-react';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    const password = String(form.get('password') || '');
    const confirmPassword = String(form.get('confirmPassword') || '');

    if (password.length < 8) {
      setMessage('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    setMessage(
      'Account registration is ready. Connect this form to your backend.'
    );
  };

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <div className="auth-visual-inner">
          <Link href="/" className="auth-brand">
            <span className="brand-symbol">K</span>
            <span>KoletPay</span>
          </Link>

          <div className="auth-copy">
            <span className="auth-kicker">Business made simpler</span>

            <h1>
              Everything your business needs in one place.
            </h1>

            <p>
              Create invoices, manage customers, track payments and stay on top
              of your business from one simple workspace.
            </p>
          </div>

          <div className="auth-proof">
            <div className="auth-proof-card">
              <span>Invoices</span>
              <strong>Create and track invoices</strong>
              <small>
                Know what has been paid and what is still outstanding.
              </small>
            </div>

            <div className="auth-proof-card">
              <span>Payments</span>
              <strong>Understand your cash flow</strong>
              <small>
                Keep your customer payments organized in one place.
              </small>
            </div>
          </div>
        </div>
      </section>

      <section className="auth-form-panel">
        <div className="auth-form-wrap">

          <div className="auth-mobile-brand">
            <Link href="/" className="auth-brand">
              <span className="brand-symbol">K</span>
              <span>KoletPay</span>
            </Link>
          </div>

          <div className="auth-heading">
            <span className="eyebrow">Create account</span>

            <h2>Start using KoletPay</h2>

            <p>
              Create your account and set up your business workspace.
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field-grid">

              <div className="form-group">
                <label className="label" htmlFor="fullName">
                  Full name
                </label>

                <div className="auth-input">
                  <UserRound size={17} />

                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    placeholder="Your full name"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="label" htmlFor="businessName">
                  Business name
                </label>

                <div className="auth-input">
                  <span className="auth-input-letter">K</span>

                  <input
                    id="businessName"
                    name="businessName"
                    type="text"
                    autoComplete="organization"
                    placeholder="Your business name"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="label" htmlFor="email">
                  Email address
                </label>

                <div className="auth-input">
                  <Mail size={17} />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="label" htmlFor="phone">
                  Phone number
                </label>

                <div className="auth-input">
                  <Phone size={17} />

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+234 800 000 0000"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="label" htmlFor="password">
                  Password
                </label>

                <div className="auth-input">
                  <LockKeyhole size={17} />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    required
                  />

                  <button
                    type="button"
                    className="auth-eye"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="label" htmlFor="confirmPassword">
                  Confirm password
                </label>

                <div className="auth-input">
                  <LockKeyhole size={17} />

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Repeat your password"
                    required
                  />

                  <button
                    type="button"
                    className="auth-eye"
                    onClick={() => setShowConfirm(!showConfirm)}
                    aria-label="Toggle password visibility"
                  >
                    {showConfirm ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </div>

            </div>

            <label className="auth-terms">
              <input type="checkbox" required />

              <span>
                I agree to the KoletPay terms and privacy policy.
              </span>
            </label>

            <button type="submit" className="btn blue auth-submit">
              Create account
              <ArrowRight size={16} />
            </button>

            {message && (
              <p className="auth-message" role="status">
                {message}
              </p>
            )}
          </form>

          <p className="auth-footer">
            Already have an account?{' '}
            <Link href="/login">Sign in</Link>
          </p>
        </div>
      </section>
    </main>
  );
}