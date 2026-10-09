"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/**
 * UI preview session only. This is not authentication or authorization.
 * Do not use it to protect real business data or API endpoints.
 */
export type DemoIdentity = {
  displayName: string;
  businessName: string;
  email: string;
};

type DemoSession = {
  ready: boolean;
  identity: DemoIdentity | null;
  enterDemo: (identity: DemoIdentity) => void;
  exitDemo: () => void;
};

const KEY = "koletpay-preview-session-v1";
const Context = createContext<DemoSession | null>(null);

function isDemoIdentity(value: unknown): value is DemoIdentity {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.displayName === "string" &&
    typeof candidate.businessName === "string" &&
    typeof candidate.email === "string"
  );
}

export function DemoSessionProvider({ children }: { children: ReactNode }) {
  const [identity, setIdentity] = useState<DemoIdentity | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY);
      if (stored) {
        const value: unknown = JSON.parse(stored);
        if (isDemoIdentity(value)) setIdentity(value);
      }
    } catch {
      // Browser storage may be disabled. The preview still works in this tab.
    }
    setReady(true);
  }, []);

  const enterDemo = (nextIdentity: DemoIdentity) => {
    setIdentity(nextIdentity);
    try {
      localStorage.setItem(KEY, JSON.stringify(nextIdentity));
    } catch {
      // Preview access still works for the current render tree.
    }
  };

  const exitDemo = () => {
    setIdentity(null);
    try {
      localStorage.removeItem(KEY);
    } catch {
      // No-op if browser storage is disabled.
    }
  };

  return (
    <Context.Provider value={{ ready, identity, enterDemo, exitDemo }}>
      {children}
    </Context.Provider>
  );
}

export function useDemoSession() {
  const session = useContext(Context);
  if (!session) throw new Error("DemoSessionProvider is missing");
  return session;
}
