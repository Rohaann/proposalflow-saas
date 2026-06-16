"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type Currency = "USD" | "EUR" | "GBP" | "AUD" | "CAD";

export interface BrandSettings {
  companyName: string;
  userName: string;
  email: string;
  currency: Currency;
  themeColor: string;
  taxRate: number;
}

interface BrandContextType {
  brand: BrandSettings;
  setBrand: React.Dispatch<React.SetStateAction<BrandSettings>>;
  formatCurrency: (amount: number) => string;
}

const defaultBrand: BrandSettings = {
  companyName: "Your Agency LLC",
  userName: "Jane Doe",
  email: "hello@youragency.com",
  currency: "USD",
  themeColor: "#000000",
  taxRate: 0,
};

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export function BrandProvider({ children }: { children: ReactNode }) {
  const [brand, setBrand] = useState<BrandSettings>(defaultBrand);

  const formatCurrency = (amount: number) => {
    const symbols: Record<Currency, string> = {
      USD: "$",
      EUR: "€",
      GBP: "£",
      AUD: "A$",
      CAD: "C$",
    };
    return `${symbols[brand.currency]}${amount.toLocaleString()}`;
  };

  return (
    <BrandContext.Provider value={{ brand, setBrand, formatCurrency }}>
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  const context = useContext(BrandContext);
  if (context === undefined) {
    throw new Error("useBrand must be used within a BrandProvider");
  }
  return context;
}
