import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { ChunkRecovery } from "@/components/ChunkRecovery";
import { Layout } from "@/components/Layout";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alba Prototype",
  description:
    "Local prototype for a Portable Human Portfolio, life crafting scenarios, and wellbeing design.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f7f1e5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[var(--alba-bg)] text-alba-ink antialiased">
        <ChunkRecovery />
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
