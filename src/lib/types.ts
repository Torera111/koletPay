export type Customer = {
  id: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  contact: "Phone" | "Email" | "WhatsApp";
  joinedAt: string;
  notes: string;
  project: string;
  projectDetails: string;
  projectDue: string;
};
export type Product = {
  id: string;
  name: string;
  kind: "Product" | "Service";
  price: number;
  description: string;
};
export type LineItem = {
  productId: string;
  description: string;
  quantity: number;
  unitPrice: number;
};
export type Payment = {
  id: string;
  amount: number;
  date: string;
  method: string;
  status?: "SUCCESSFUL" | "PENDING" | "FAILED";
};
export type Invoice = {
  id: string;
  customerId: string;
  issuedAt: string;
  dueAt: string;
  items: LineItem[];
  payments: Payment[];
  notes: string;
};
export type StoreData = {
  customers: Customer[];
  products: Product[];
  invoices: Invoice[];
  business: { name: string; email: string; phone: string };
};
export type InvoiceStatus = "Paid" | "Partially paid" | "Overdue" | "Pending";
export const amountOf = (invoice: Invoice) =>
  invoice.items.reduce((n, i) => n + i.unitPrice * i.quantity, 0);
export const paidOf = (invoice: Invoice) =>
  invoice.payments.reduce((n, p) => n + p.amount, 0);
export const remainingOf = (invoice: Invoice) =>
  Math.max(0, amountOf(invoice) - paidOf(invoice));
export const statusOf = (invoice: Invoice): InvoiceStatus => {
  if (remainingOf(invoice) === 0) return "Paid";
  if (invoice.dueAt < new Date().toISOString().slice(0, 10)) return "Overdue";
  if (paidOf(invoice) > 0) return "Partially paid";
  return "Pending";
};
export const money = (n: number) => "₦" + Math.round(n).toLocaleString("en-NG");
export const shortDate = (date: string) =>
  new Date(date + "T12:00:00").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
export const dateISO = (offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
};
export const uid = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
