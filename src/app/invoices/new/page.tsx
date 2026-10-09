"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";
import { PageHead } from "@/components/Shell";
import { useKoletPay } from "@/lib/store";
import { dateISO, money, uid, type LineItem } from "@/lib/types";

type DraftItem = {
  key: string;
  productId: string;
  description: string;
  quantity: string;
  unitPrice: string;
};

const blankItem = (): DraftItem => ({
  key: uid("line"),
  productId: "",
  description: "",
  quantity: "1",
  unitPrice: "",
});

export default function NewInvoicePage() {
  const router = useRouter();
  const { data, ready, addInvoice } = useKoletPay();
  const [customerId, setCustomerId] = useState("");
  const [dueAt, setDueAt] = useState(() => dateISO(7));
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<DraftItem[]>([blankItem()]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const updateItem = (key: string, patch: Partial<DraftItem>) => {
    setItems((current) => current.map((item) => (item.key === key ? { ...item, ...patch } : item)));
  };

  const selectProduct = (key: string, productId: string) => {
    const product = data.products.find((p) => p.id === productId);
    updateItem(key, product
      ? { productId, description: product.name, unitPrice: String(product.price) }
      : { productId: "", description: "", unitPrice: "" });
  };

  const total = items.reduce((sum, item) => {
    const qty = Number(item.quantity);
    const price = Number(item.unitPrice);
    return sum + (Number.isFinite(qty) && Number.isFinite(price) && qty > 0 && price > 0
      ? qty * price : 0);
  }, 0);

  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving || !ready) return;
    setError("");

    if (!data.customers.some((customer) => customer.id === customerId)) {
      setError("Select a customer for this invoice.");
      return;
    }
    if (!dueAt || dueAt < dateISO()) {
      setError("Choose a due date of today or later.");
      return;
    }
    if (items.length === 0) {
      setError("Add at least one item.");
      return;
    }

    const invoiceItems: LineItem[] = [];
    for (const item of items) {
      const quantity = Number(item.quantity);
      const unitPrice = Number(item.unitPrice);
      if (!item.description.trim() || !Number.isInteger(quantity) || quantity < 1 ||
          !Number.isInteger(unitPrice) || unitPrice < 1) {
        setError("Each item needs a description, a whole-number quantity, and a price of at least ₦1.");
        return;
      }
      invoiceItems.push({
        productId: item.productId,
        description: item.description.trim(),
        quantity,
        unitPrice,
      });
    }

    setSaving(true);
    try {
      const invoiceId = addInvoice({
        customerId,
        dueAt,
        notes: notes.trim(),
        items: invoiceItems,
      });
      router.push(`/invoices/${encodeURIComponent(invoiceId)}`);
    } catch {
      setSaving(false);
      setError("The invoice could not be saved. Please try again.");
    }
  };

  return (
    <>
      <div className="filter-row">
        <Link href="/invoices" className="btn sm"><ArrowLeft size={16} /> All invoices</Link>
        <span className="pill">Frontend demo · saved in this browser</span>
      </div>
      <PageHead
        title="Create invoice"
        sub="Prepare an invoice for an existing customer. No real payment will be collected."
      />

      <form onSubmit={save}>
        <div className="grid-main">
          <div>
            <section className="card">
              <h2 className="title-sm">Customer & due date</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="invoice-customer" className="label">Customer</label>
                  <select
                    id="invoice-customer"
                    className="field"
                    value={customerId}
                    onChange={(event) => setCustomerId(event.target.value)}
                    required
                  >
                    <option value="">Select a customer</option>
                    {data.customers.map((customer) => (
                      <option value={customer.id} key={customer.id}>{customer.name}</option>
                    ))}
                  </select>
                  {data.customers.length === 0 && (
                    <span className="form-help">No customers yet. <Link href="/customers">Add a customer</Link> first.</span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="invoice-due" className="label">Due date</label>
                  <input
                    id="invoice-due"
                    type="date"
                    min={dateISO()}
                    className="field"
                    value={dueAt}
                    onChange={(event) => setDueAt(event.target.value)}
                    required
                  />
                </div>
              </div>
            </section>

            <section className="card">
              <div className="card-head">
                <h2>Invoice items</h2>
                <button type="button" className="btn sm" onClick={() => setItems((current) => [...current, blankItem()])}>
                  <Plus size={15} /> Add item
                </button>
              </div>
              {items.map((item, index) => (
                <div key={item.key} style={{ padding: "16px 0", borderTop: index ? "1px solid var(--line)" : "0" }}>
                  <div className="card-head" style={{ marginBottom: 10 }}>
                    <strong>Item {index + 1}</strong>
                    <button
                      className="btn sm danger"
                      type="button"
                      aria-label={`Remove item ${index + 1}`}
                      disabled={items.length === 1}
                      onClick={() => setItems((current) => current.filter((line) => line.key !== item.key))}
                    ><Trash2 size={15} /> Remove</button>
                  </div>
                  <div className="form-group">
                    <label className="label" htmlFor={`product-${item.key}`}>Choose from your catalog (optional)</label>
                    <select
                      id={`product-${item.key}`}
                      className="field"
                      value={item.productId}
                      onChange={(event) => selectProduct(item.key, event.target.value)}
                    >
                      <option value="">Custom item / service</option>
                      {data.products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name} — {money(product.price)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor={`description-${item.key}`} className="label">Item description</label>
                    <input
                      id={`description-${item.key}`}
                      className="field"
                      value={item.description}
                      maxLength={160}
                      onChange={(event) => updateItem(item.key, { description: event.target.value })}
                      placeholder="e.g. 20 custom mugs"
                      required
                    />
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor={`quantity-${item.key}`} className="label">Quantity</label>
                      <input
                        id={`quantity-${item.key}`}
                        type="number"
                        min="1"
                        step="1"
                        className="field"
                        value={item.quantity}
                        onChange={(event) => updateItem(item.key, { quantity: event.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor={`price-${item.key}`} className="label">Unit price (₦)</label>
                      <input
                        id={`price-${item.key}`}
                        type="number"
                        min="1"
                        step="1"
                        className="field"
                        value={item.unitPrice}
                        onChange={(event) => updateItem(item.key, { unitPrice: event.target.value })}
                        placeholder="0"
                        required
                      />
                    </div>
                  </div>
                  <p className="small" style={{ textAlign: "right" }}>
                    Line total: <b>{money(Math.max(0, Number(item.quantity) * Number(item.unitPrice)) || 0)}</b>
                  </p>
                </div>
              ))}
            </section>

            <section className="card">
              <h2 className="title-sm">Notes (optional)</h2>
              <label className="label" htmlFor="invoice-notes">Project or delivery details</label>
              <textarea
                id="invoice-notes"
                className="field"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Add any instructions for your customer"
                maxLength={1000}
              />
            </section>
          </div>

          <div>
            <section className="card">
              <h2 className="title-sm">Invoice summary</h2>
              <div className="kv"><span className="key">Business</span><span className="val">{data.business.name}</span></div>
              <div className="kv"><span className="key">Customer</span><span className="val">{data.customers.find((c) => c.id === customerId)?.name || "Not selected"}</span></div>
              <div className="kv"><span className="key">Number of items</span><span className="val">{items.length}</span></div>
              <div className="kv"><span className="key">Due date</span><span className="val">{dueAt || "Not set"}</span></div>
              <div className="divider" />
              <div className="status-line"><b>Total</b><strong className="money-big">{money(total)}</strong></div>
              <p className="section-sub">A new invoice will start as unpaid. You can simulate payments on its details page.</p>
              {error && <p role="alert" className="danger-text" style={{ marginBottom: 12 }}>{error}</p>}
              <button className="btn blue block" type="submit" disabled={!ready || saving || !data.customers.length}>
                <Save size={16} /> {saving ? "Saving…" : "Save invoice"}
              </button>
              <Link href="/invoices" className="btn block" style={{ marginTop: 10 }}>Cancel</Link>
            </section>
          </div>
        </div>
      </form>
    </>
  );
}
