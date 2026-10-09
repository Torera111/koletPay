import type { Metadata } from "next";
import { StoreProvider } from "@/lib/store";
import { Shell } from "@/components/Shell";
import { DemoSessionProvider } from "@/lib/demo-session";
import { AuthProvider } from "@/lib/auth";
import { DemoAccessGate } from "@/components/DemoAccessGate";
import "./global.css";
export const metadata: Metadata = {
  title: "KoletPay | Invoice & Customer Ledger",
  description:
    "A responsive web-based business ledger and invoicing demo for Nigerian small businesses.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <DemoSessionProvider>
            <StoreProvider>
              <DemoAccessGate>
                <Shell>{children}</Shell>
              </DemoAccessGate>
            </StoreProvider>
          </DemoSessionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
