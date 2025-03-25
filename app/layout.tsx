// app/layout.tsx
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import ClientProvider from './components/ClientProvider';
import './globals.css';
import { ThemeProvider } from './components/ThemeContext';
import Layout from './components/Layout';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'LearNoted: Save, Define & Highlight Your Way Through the Web',
  description:
    'Transform how you browse with LearNoted. Look up words instantly, highlight important content, and save video timestamps—all in one dashboard. Your personal web learning assistant.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/LearNoted-logo-white-512.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
    shortcut: [{ url: '/favicon.ico' }],
  },
  manifest: '/site.webmanifest',
  other: {
    'google-site-verification': 'OUXooCc_fRcKZ9mOTlYEnT8NJCOIdpjE1t_zT_nm2B4',
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <head>
        {/* Add this script to prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Check for stored theme preference
                const storedTheme = localStorage.getItem('theme');
                
                // If we have a stored theme, use it
                if (storedTheme) {
                  document.documentElement.classList.toggle('dark', storedTheme === 'dark');
                } else {
                  // Otherwise, check system preference
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  document.documentElement.classList.toggle('dark', prefersDark);
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider>
          <Layout>
            <ClientProvider>{children}</ClientProvider>
          </Layout>
        </ThemeProvider>
      </body>
    </html>
  );
}
