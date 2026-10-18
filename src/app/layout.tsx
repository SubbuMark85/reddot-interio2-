import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f6f3f0' },
    { media: '(prefers-color-scheme: dark)', color: '#0d0d0d' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'RedDot Interio | Luxury Interior Design & Turnkey Architecture Hyderabad',
  description:
    'RedDot Interio is Hyderabad’s premier architectural interior design studio. Bespoke luxury villas, modular kitchens, and turnkey residences in Jubilee Hills, Financial District, and Kokapet. Call +91 93489 23689.',
  keywords: [
    'Interior Designers in Hyderabad',
    'Luxury Interior Design Jubilee Hills',
    'Turnkey Interior Contractors Hyderabad',
    'Modular Kitchen Hyderabad',
    'Villa Interiors Kokapet',
    'Financial District Hyderabad Interior Decorators',
    'RedDot Interio',
    'Best Interior Studio Hyderabad',
  ],
  authors: [{ name: 'RedDot Interio Hyderabad' }],
  creator: 'RedDot Interio',
  metadataBase: new URL('https://reddotinterio.com'),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://reddotinterio.com',
    title: 'RedDot Interio | Bespoke Interior Architecture in Hyderabad',
    description:
      'Elevated interior design and turnkey execution in Hyderabad. 45-day guaranteed handover, German fittings, and 10-year warranty.',
    siteName: 'RedDot Interio',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'RedDot Interio Luxury Villa Interior Hyderabad',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RedDot Interio | Luxury Interior Architecture Hyderabad',
    description:
      'Modern, minimal, turnkey residential interiors across Hyderabad. German precision hardware & bespoke Italian aesthetics.',
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    name: 'RedDot Interio',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    telephone: '+91 93489 23689',
    email: 'bhaskarjv3689@gmail.com',
    url: 'https://reddotinterio.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Road No. 36, Jubilee Hills',
      addressLocality: 'Hyderabad',
      addressRegion: 'Telangana',
      postalCode: '500033',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 17.4326,
      longitude: 78.4071,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:30',
        closes: '19:30',
      },
    ],
    priceRange: '₹₹₹',
    areaServed: [
      'Hyderabad',
      'Jubilee Hills',
      'Banjara Hills',
      'Financial District',
      'Gachibowli',
      'Hitec City',
      'Kokapet',
      'Kondapur',
      'Madhapur',
    ],
    sameAs: [
      'https://www.instagram.com',
      'https://wa.me/919348923689',
    ],
  };

  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased selection:bg-brand-red selection:text-white">
        {children}
      </body>
    </html>
  );
}
