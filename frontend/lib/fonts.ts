import localFont from 'next/font/local';

export const fontProximaNova = localFont({
  src: [
    {
      path: '../public/fonts/ProximaNova-Regular.otf',
      weight: '400', // Regular
    },
    {
      path: '../public/fonts/ProximaNova-Light.otf',
      weight: '300', // Light
    },
    {
      path: '../public/fonts/Proxima-Nova-Bold.otf',
      weight: '700', // Bold
    },
    {
      path: '../public/fonts/ProximaNova-Extrabold.otf',
      weight: '800', // Extrabold
    },
  ],
  variable: '--font-proxima-nova',
});
