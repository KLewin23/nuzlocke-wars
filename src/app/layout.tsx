import type { Metadata } from "next";
import { Quattrocento_Sans, Rye } from "next/font/google";

import localFont from 'next/font/local'
import "./globals.css";

const railroadGothic = localFont({
  src:  '../../public/RailroadGothicCC.ttf', 
  variable: '--font-railroad-gothic'
})

const quattrocentoSans = Quattrocento_Sans({
  variable: '--font-quattrocento-sans',
  weight: ["400", "700"]
})

const rye = Rye({
  variable: '--font-rye',
  weight: ["400"]
})

export const metadata: Metadata = {
  title: "Nuzlocke Wars",
  description: "Nuzlocke wars tournement",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${quattrocentoSans.variable} ${railroadGothic.variable} ${rye.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
