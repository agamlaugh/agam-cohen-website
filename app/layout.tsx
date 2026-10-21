import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const description =
  "Computer Science student at the University of Edinburgh building systems-level software: a custom memory allocator and a peer-to-peer network node.";

export const metadata: Metadata = {
  metadataBase: new URL("https://agam-cohen-website.vercel.app"),
  title: {
    default: "Agam Rain Cohen | Software Engineering & Systems",
    template: "%s | Agam Rain Cohen",
  },
  description,
  openGraph: {
    title: "Agam Rain Cohen | Software Engineering & Systems",
    description,
    url: "/",
    siteName: "Agam Rain Cohen",
    type: "website",
    locale: "en_GB",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
