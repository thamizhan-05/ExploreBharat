import './globals.css';
import type { Metadata } from 'next';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata: Metadata = {
  title: 'ExploreBharat — Discover India. Plan Your Journey.',
  description: 'ExploreBharat is an India tourism platform to discover tourist places, plan trips, find hotels, explore experiences, and book travel services.',
  keywords: [
    'ExploreBharat',
    'India tourism',
    'tourist places in India',
    'places to visit in India',
    'India travel',
    'hotels near tourist places',
    'India trip planner',
    'tourist attractions',
    'free tourist places',
    'India travel itinerary'
  ],
  openGraph: {
    title: 'ExploreBharat — Discover India. Plan Your Journey.',
    description: 'ExploreBharat is an India tourism platform to discover tourist places, plan trips, find hotels, explore experiences, and book travel services.',
    siteName: 'ExploreBharat',
    locale: 'en_IN',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ExploreBharat — Discover India. Plan Your Journey.',
    description: 'ExploreBharat is an India tourism platform to discover tourist places, plan trips, find hotels, explore experiences, and book travel services.'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        <link rel="manifest" href="/manifest.json" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Merriweather:ital,wght@0,400;0,700;0,900;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-stone-50 text-stone-900 antialiased">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
