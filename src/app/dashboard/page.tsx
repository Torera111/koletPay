"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CircleDollarSign,
  Clock3,
  Plus,
  ReceiptText,
  Users,
  Wallet,
} from "lucide-react";
import { useKoletPay } from "@/lib/store";
import { totals } from "@/lib/metrics";
import { money, remainingOf, shortDate, statusOf } from "@/lib/types";
import { PageHead, QuickLink, Status } from "@/components/Shell";
import { RevenueChart } from "@/components/RevenueChart";

export default function DashboardPage() {
  const { data } = useKoletPay();
  const overview = totals(data, "month");
  const overdue = data.invoices.filter((invoice) => statusOf(invoice) === "Overdue");
  const overdueBalance = overdue.reduce((sum, invoice) => sum + remainingOf(invoice), 0);
  const latest = [...data.invoices]
    .sort((a, b) => b.issuedAt.localeCompare(a.issuedAt) || b.id.localeCompare(a.id))
    .slice(0, 5);

  return (
    <>
      <PageHead
        title="Business overview"
        sub={`Welcome to ${data.business.name}. Here's how your business is doing.`}
        action={
          <Link href="/invoices/new" className="btn blue">
            <Plus size={16} /> Create invoice
          </Link>
        }
      />

      <div className="stats">
        <div className="stat blueish">
          <span className="stat-head"><CircleDollarSign size={17} /> Received this month</span>
          <strong>{money(overview.revenue)}</strong>
          <small>From payments recorded in the demo</small>
        </div>
        <div className="stat greenish">
          <span className="stat-head"><ReceiptText size={17} /> Invoices this month</span>
          <strong>{overview.invoices}</strong>
          <small>{data.invoices.length} invoices in total</small>
        </div>
        <div className="stat amberish">
          <span className="stat-head"><Wallet size={17} /> Outstanding balance</span>
          <strong>{money(overview.outstanding)}</strong>
          <small>Unpaid across all invoices</small>
        </div>
        <div className="stat pinkish">
          <span className="stat-head"><Clock3 size={17} /> Overdue invoices</span>
          <strong>{overdue.length}</strong>
          <small>{money(overdueBalance)} overdue balance</small>
        </div>
      </div>

      <div className="grid-main">
        <div>
          <section className="card">
            <div className="card-head">
              <h2>Revenue trend</h2>
              <Link href="/reports">View reports <ArrowRight size={12} /></Link>
            </div>
            <RevenueChart period="month" />
          </section>

          <section className="card">
            <div className="card-head">
              <h2>Recent invoices</h2>
              <Link href="/invoices">All invoices <ArrowRight size={12} /></Link>
            </div>
            {latest.length ? (
              latest.map((invoice) => {
                const customer = data.customers.find((c) => c.id === invoice.customerId);
                return (
                  <Link className="row" href={`/invoices/${encodeURIComponent(invoice.id)}`} key={invoice.id}>
                    <span className="avatar"><ReceiptText size={19} /></span>
                    <span className="content">
                      <b>{invoice.id} · {customer?.name || "Unknown customer"}</b>
                      <p>Due {shortDate(invoice.dueAt)}</p>
                    </span>
                    <span className="end">
                      <b>{money(remainingOf(invoice))} due</b>
                      <Status status={statusOf(invoice)} />
                    </span>
                  </Link>
                );
              })
            ) : (
              <p className="muted">No invoices yet. Create your first invoice to get started.</p>
            )}
          </section>
        </div>

        <div>
          <section className="card">
            <h2 className="title-sm">Quick actions</h2>
            <div className="quick-grid" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
              <QuickLink href="/invoices/new" icon={<Plus size={21} />} title="New invoice" />
              <QuickLink href="/customers" icon={<Users size={21} />} title="Customers" />
              <QuickLink href="/invoices" icon={<ReceiptText size={21} />} title="Invoices" />
              <QuickLink href="/reports" icon={<BarChart3 size={21} />} title="Reports" />
            </div>
          </section>

          <section className="card">
            <h2 className="title-sm">Your business at a glance</h2>
            <div className="kv"><span className="key">Customers</span><span className="val">{data.customers.length}</span></div>
            <div className="kv"><span className="key">Products & services</span><span className="val">{data.products.length}</span></div>
            <div className="kv"><span className="key">Recorded payments this month</span><span className="val">{overview.sales}</span></div>
            <div className="kv"><span className="key">Outstanding invoices</span><span className="val">{data.invoices.filter((invoice) => remainingOf(invoice) > 0).length}</span></div>
          </section>

          <div className="note">
            This is a frontend-only demonstration using browser data. Figures are not bank-verified.
          </div>
        </div>
      </div>
    </>
  );
}
