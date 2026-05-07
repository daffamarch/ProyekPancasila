import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

import LayoutContent from "@/components/LayoutContent";

export const metadata: Metadata = {
  title: "Raih Asa: Hari Ceria, Diriku Berharga",
  description: "Sistem monitoring hafalan Al-Quran dan pembinaan karakter anak.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <LayoutContent>
          {children}
        </LayoutContent>
      </body>
    </html>
  );
}
