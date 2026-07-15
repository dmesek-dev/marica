import './globals.css';

// WhatsApp requires an absolute og:image URL, so the fallback must be the real
// production domain — localhost here silently kills the preview image.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mmmmmisic.com';

// Static snapshot in /public: WhatsApp drops og:image files over ~600 KB and
// times out easily, so a small CDN-served JPEG beats a generated PNG route.
const ogImage = {
  url: '/og.jpg',
  width: 1200,
  height: 630,
  alt: 'Marica slavi 360 mjeseci — 29.8.2026.',
};

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Marica slavi 360 mjeseci 🪩',
  description: 'Pozivnica — javi se, dolaziš li na Maricin rođendan 29.8.2026.',
  openGraph: {
    title: 'Marica slavi 360 mjeseci 🪩',
    description: '29.8.2026. od 21h — Downstairs, Krešićeva 32. Javi se!',
    type: 'website',
    locale: 'hr_HR',
    images: [ogImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Marica slavi 360 mjeseci 🪩',
    description: '29.8.2026. od 21h — Downstairs, Krešićeva 32. Javi se!',
    images: [ogImage],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#8A4BB8',
};

export default function RootLayout({ children }) {
  return (
    <html lang="hr">
      <body>{children}</body>
    </html>
  );
}
