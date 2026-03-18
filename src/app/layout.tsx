import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BeforeScroll — Before you scroll, do something real.",
  description:
    "Lock addictive apps. Complete a challenge. Earn your scroll time.",
  metadataBase: new URL("https://beforescroll.app"),
  openGraph: {
    title: "BeforeScroll — Before you scroll, do something real.",
    description:
      "Lock addictive apps. Complete a challenge. Earn your scroll time.",
    url: "https://beforescroll.app",
    siteName: "BeforeScroll",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BeforeScroll — Before you scroll, do something real.",
    description:
      "Lock addictive apps. Complete a challenge. Earn your scroll time.",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${dmSerif.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
