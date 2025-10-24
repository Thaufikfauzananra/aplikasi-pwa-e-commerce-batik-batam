import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Font bawaan Next.js
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata halaman
export const metadata = {
  title: "Batik Cindur Batam",
  description: "Aplikasi PWA e-Commerce Batik Cindur Batam",
};

// Layout utama
export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        {/* ✅ Tambahkan Material Icons agar ikon di form register muncul */}
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#fefaf6] text-[#5a3921]`}
      >
        {children}
      </body>
    </html>
  );
}
