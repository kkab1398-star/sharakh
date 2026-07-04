import type { Metadata } from "next";
import { Cairo, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme-context";

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '700', '900'],
  variable: '--font-cairo',
  display: 'swap',
});

const barlow = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['700', '900'],
  variable: '--font-barlow',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "منصة شراكة",
  description: "نظام إدارة الشراكة للمعدات الثقيلة",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${barlow.variable}`}>
      <body style={{ fontFamily: "'Cairo', 'Barlow Condensed', sans-serif", margin: 0 }}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
