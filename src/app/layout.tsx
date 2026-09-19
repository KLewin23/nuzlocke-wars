import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import localFont from 'next/font/local'
import "./globals.css";

const jerseyFont = localFont({
  src:  '../../public/jersey/Jersey10-Regular.ttf'
})

export const metadata: Metadata = {
  title: "Nuzlocke Wars",
  description: "Nuzlocke wars tournement",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${jerseyFont.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
