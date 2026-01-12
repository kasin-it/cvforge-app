import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import { ApiKeyProvider } from "@/contexts/api-key-context";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { env } from "@/env";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CVForge - Optimize Your CV",
  description: "Craft the perfect CV tailored to any job posting",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const hasEnvKey = !!env.OPENAI_API_KEY;

  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${dmSans.variable} font-sans antialiased`}
      >
        <ApiKeyProvider hasEnvKey={hasEnvKey}>{children}</ApiKeyProvider>
        <Analytics />
      </body>
    </html>
  );
}
