"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

type ApiKeyContextValue = {
  apiKey: string;
  setApiKey: (key: string) => void;
  clearApiKey: () => void;
  hasValidKey: boolean;
  hasEnvKey: boolean;
};

const ApiKeyContext = createContext<ApiKeyContextValue | null>(null);

type ApiKeyProviderProps = {
  children: ReactNode;
  hasEnvKey?: boolean;
};

export function ApiKeyProvider({ children, hasEnvKey = false }: ApiKeyProviderProps) {
  const [apiKey, setApiKeyState] = useState("");

  const setApiKey = useCallback((key: string) => {
    // Strip any non-ASCII characters (hidden Unicode chars from copy-paste)
    const sanitizedKey = key.replace(/[^\x00-\x7F]/g, "").trim();
    setApiKeyState(sanitizedKey);
  }, []);

  const clearApiKey = useCallback(() => {
    setApiKeyState("");
  }, []);

  // Basic validation: OpenAI keys start with "sk-"
  const hasValidKey = hasEnvKey || (apiKey.startsWith("sk-") && apiKey.length > 20);

  return (
    <ApiKeyContext.Provider value={{ apiKey, setApiKey, clearApiKey, hasValidKey, hasEnvKey }}>
      {children}
    </ApiKeyContext.Provider>
  );
}

export function useApiKey() {
  const context = useContext(ApiKeyContext);
  if (!context) {
    throw new Error("useApiKey must be used within an ApiKeyProvider");
  }
  return context;
}
