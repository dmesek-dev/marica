import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Marica slavi 360 mjeseci 🪩',
  description: 'Pozivnica — javi se, dolaziš li na Maricin rođendan 29.8.2026.',
  openGraph: {
    title: 'Marica slavi 360 mjeseci 🪩',
    description: '29.8.2026. od 21h — Downstairs, Krešićeva 32. Javi se!',
    type: 'website',
    locale: 'hr_HR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Marica slavi 360 mjeseci 🪩',
    description: '29.8.2026. od 21h — Downstairs, Krešićeva 32. Javi se!',
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
