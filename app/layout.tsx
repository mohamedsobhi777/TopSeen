import type { Metadata } from "next";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import { Playfair_Display, Inter } from "next/font/google";

import { LocalDBProvider } from "./provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { cn } from "@/lib/utils";

import "./globals.css";
import { NavigationWithTour } from "@/components/navigation-with-tour";

const playfair = Playfair_Display({
  variable: "--playfair",
  subsets: ["latin"],
});
const inter = Inter({ subsets: ["latin"], variable: "--inter" });

// Example metadata with decent SEO for PWA
export const metadata: Metadata = {
  title:
    "TopSeen - Instagram DM Automation & Influencer Outreach Platform",
  description:
    "Automate your Instagram DM campaigns and grow your network with TopSeen. Find influencers, manage outreach campaigns, and track responses all in one powerful platform.",
  manifest: "/manifest.json",
  generator: "Next.js",
  keywords: [
    "Instagram DM automation",
    "influencer outreach",
    "Instagram marketing",
    "social media automation",
    "DM campaigns",
    "Instagram growth",
    "influencer marketing",
    "social media management",
    "automated messaging",
    "Instagram tools",
  ],
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#FFB6E1" },
    { media: "(prefers-color-scheme: light)", color: "#FBE3EA" }
  ],
  authors: [
    { name: "TopSeen" },
    {
      name: "TopSeen",
      url: "https://www.topseen.co",
    },
  ],
  viewport:
    "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
  icons: [
    { rel: "apple-touch-icon", url: "/apple-touch-icon.png" },
    { rel: "icon", url: "/favicon-32x32.png" },
  ],
  openGraph: {
    title: "TopSeen - Instagram DM Automation Platform",
    description: "Automate your Instagram outreach and grow your network with powerful DM automation tools.",
    url: "https://www.topseen.co",
    siteName: "TopSeen",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TopSeen - Instagram DM Automation Platform",
    description: "Automate your Instagram outreach and grow your network with powerful DM automation tools.",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <LocalDBProvider>
        <body
          className={cn(
            "bg-background font-sans antialiased",
            playfair.variable,
            inter.variable
          )}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider>
              <main className="bg-background">
                <NavigationWithTour>
                  {children}
                </NavigationWithTour>
              </main>
            </TooltipProvider>
            <Toaster richColors position="top-center" />
          </ThemeProvider>
        </body>
      </LocalDBProvider>
    </html>
  );
}
