'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from 'lucide-react';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setMessage(
      'Login form is ready. Connect this form to your authentication backend.'
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
            <span className="auth-kicker">Welcome back</span>

            <h1>
              Your business, right where you left it.
            </h1>

            <p>
              Log in to manage your customers, invoices, payments and business
              reports.
            </p>
          </div>

          <div className="auth-proof">
            <div className="auth-proof-card">
              <span>Customers</span>
              <strong>Keep every customer organized</strong>
              <small>
                Access customer records and payment history quickly.
              </small>
            </div>

            <div className="auth-proof-card">
              <span>Reports</span>
              <strong>See how your business is doing</strong>
              <small>
                Keep track of revenue and outstanding balances.
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
            <span className="eyebrow">Welcome back</span>

            <h2>Sign in to KoletPay</h2>

            <p>
              Enter your account details to continue.
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>

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
              <div className="auth-password-label">
                <label className="label" htmlFor="password">
                  Password
                </label>

                <button
                  type="button"
                  className="forgot-link"
                  onClick={() =>
                    setMessage('Password recovery will be connected next.')
                  }
                >
                  Forgot password?
                </button>
              </div>

              <div className="auth-input">
                <LockKeyhole size={17} />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
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

            <button type="submit" className="btn blue auth-submit">
              Sign in
              <ArrowRight size={16} />
            </button>

            {message && (
              <p className="auth-message" role="status">
                {message}
              </p>
            )}
          </form>

          <p className="auth-footer">
            Don't have an account?{' '}
            <Link href="/register">Create an account</Link>
          </p>
        </div>
      </section>
    </main>
  );
}