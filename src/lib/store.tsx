"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  Customer,
  Product,
  Invoice,
  StoreData,
  Payment,
  amountOf,
  paidOf,
  uid,
} from "./types";
import { DEMO_DATA } from "./seed";
const KEY = "koletpay-demo-v1";
type Store = {
  data: StoreData;
  ready: boolean;
  addCustomer: (record: Omit<Customer, "id" | "joinedAt">) => string;
  editCustomer: (id: string, patch: Partial<Customer>) => void;
  addProduct: (record: Omit<Product, "id">) => void;
  addInvoice: (record: Omit<Invoice, "id" | "payments" | "issuedAt">) => string;
  simulatePayment: (invoiceId: string, amount: number) => void;
  updateBusiness: (details: StoreData["business"]) => void;
  reset: () => void;
};
const Ctx = createContext<Store | null>(null);
export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<StoreData>(DEMO_DATA);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) setData(JSON.parse(saved) as StoreData);
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready)
      try {
        localStorage.setItem(KEY, JSON.stringify(data));
      } catch {}
  }, [data, ready]);
  const addCustomer = (record: Omit<Customer, "id" | "joinedAt">) => {
    const id = uid("c");
    setData((p) => ({
      ...p,
      customers: [
        { ...record, id, joinedAt: new Date().toISOString().slice(0, 10) },
        ...p.customers,
      ],
    }));
    return id;
  };
  const editCustomer = (id: string, patch: Partial<Customer>) =>
    setData((p) => ({
      ...p,
      customers: p.customers.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }));
  const addProduct = (record: Omit<Product, "id">) =>
    setData((p) => ({
      ...p,
      products: [{ ...record, id: uid("p") }, ...p.products],
    }));
  const addInvoice = (
    record: Omit<Invoice, "id" | "payments" | "issuedAt">,
  ) => {
    const id = `INV-${Date.now().toString().slice(-7)}`;
    setData((p) => ({
      ...p,
      invoices: [
        {
          ...record,
          id,
          payments: [],
          issuedAt: new Date().toISOString().slice(0, 10),
        },
        ...p.invoices,
      ],
    }));
    return id;
  };
  const simulatePayment = (invoiceId: string, amount: number) =>
    setData((p) => ({
      ...p,
      invoices: p.invoices.map((inv) => {
        if (inv.id !== invoiceId) return inv;
        const remaining = Math.max(0, amountOf(inv) - paidOf(inv));
        const actual = Math.min(Math.max(0, Math.round(amount)), remaining);
        if (actual === 0) return inv;
        const payment: Payment = {
          id: uid("pay"),
          amount: actual,
          date: new Date().toISOString().slice(0, 10),
          method: "Simulated transfer",
        };
        return { ...inv, payments: [...inv.payments, payment] };
      }),
    }));
  const updateBusiness = (details: StoreData["business"]) =>
    setData((p) => ({ ...p, business: details }));
  const reset = () => {
    setData(DEMO_DATA);
    try {
      localStorage.removeItem(KEY);
    } catch {}
  };
  return (
    <Ctx.Provider
      value={{
        data,
        ready,
        addCustomer,
        editCustomer,
        addProduct,
        addInvoice,
        simulatePayment,
        updateBusiness,
        reset,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}
export const useKoletPay = () => {
  const val = useContext(Ctx);
  if (!val) throw new Error("StoreProvider missing");
  return val;
};
