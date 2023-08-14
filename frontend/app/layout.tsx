import '@/styles/globals.css';

import ProviderWrapper from './Provider';

import { SiteHeader } from '@/components/site-header';
import { TailwindIndicator } from '@/components/tailwind-indicator';
import { fontProximaNova } from '@/lib/fonts';
import { cn } from '@/lib/utils';

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
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontProximaNova.variable,
        )}
      >
        <ProviderWrapper>
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <div className="flex-1">{children}</div>
          </div>
          <TailwindIndicator />
        </ProviderWrapper>
      </body>
    </html>
  );
}
