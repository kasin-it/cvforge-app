"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

type ApiKeyContextValue = {
  apiKey: string;
  setApiKey: (key: string) => void;
  clearApiKey: () => void;
  hasValidKey: boolean;
};

const ApiKeyContext = createContext<ApiKeyContextValue | null>(null);

export function ApiKeyProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKeyState] = useState("");

  const setApiKey = useCallback((key: string) => {
    setApiKeyState(key);
  }, []);

  const clearApiKey = useCallback(() => {
    setApiKeyState("");
  }, []);

  // Basic validation: OpenAI keys start with "sk-"
  const hasValidKey = apiKey.startsWith("sk-") && apiKey.length > 20;

  return (
    <ApiKeyContext.Provider value={{ apiKey, setApiKey, clearApiKey, hasValidKey }}>
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
