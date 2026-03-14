import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AuthProvider } from "@/components/auth-provider";
import { AppProviders } from "@/components/providers/app-providers";
import "@fontsource/plus-jakarta-sans/index.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "NextGen Manufacturing ERP",
  description:
    "Cloud-native manufacturing ERP for inventory, production, procurement, sales, and quality operations.",
  metadataBase: new URL("https://nextgen-manufacturing-erp.vercel.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background font-sans text-foreground antialiased">
        <AppProviders>
          <AuthProvider>{children}</AuthProvider>
        </AppProviders>
      </body>
    </html>
  );
}
