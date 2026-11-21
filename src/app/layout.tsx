import type { Metadata, Viewport } from 'next';
import {
  Playfair_Display,
  Plus_Jakarta_Sans,
  DM_Sans,
  Cormorant_Garamond,
} from 'next/font/google';
import './globals.css';
import { CatalogProvider } from '@/context/CatalogContext';
import SplashLoader from '@/components/SplashLoader';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dmsans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "SHEIFAST — Jasa Titip Anything's | Belanja • Titip • Kami Urus",
  description:
    'Katalog real-time diskon mall & brand 100% original (Adidas, Nike, PUMA, Converse, New Balance, Colorbox, H&M, Uniqlo) serta Event Bazaar (Part of @sheinaz.co) di Bekasi - Indonesia oleh Maritza Nalani Putri (Kak Nala).',
  icons: {
    icon: '/images/logo-sheifast.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#F9F4EB',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${playfair.variable} ${cormorant.variable} ${jakarta.variable} ${dmSans.variable}`}
    >
      <body className="font-sans bg-[#F9F4EB] text-[#2A1D15] min-h-[100dvh] flex flex-col antialiased selection:bg-[#683B1E] selection:text-[#F9F4EB]">
        <SplashLoader />
        <CatalogProvider>{children}</CatalogProvider>
      </body>
    </html>
  );
}
