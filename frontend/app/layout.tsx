import './globals.css';

import { Inter } from 'next/font/google';

import ProviderWrapper from './Provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Landing page',
  description: 'This is the GHG Tool landing page',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ProviderWrapper>
          <div>{children}</div>
        </ProviderWrapper>
      </body>
    </html>
  );
}
