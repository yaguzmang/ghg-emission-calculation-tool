import { useTranslation } from 'react-i18next';

export function WelcomeBanner() {
  const { t } = useTranslation();

  return (
    <div className="mt-12 flex w-full flex-wrap items-center justify-between gap-5 px-2 sm:px-8 lg:px-12">
      <div className="flex flex-col text-4xl font-extrabold">
        <span>{t('dashboard.home.tool.welcome')}</span>
        <span className="text-green">{t('dashboard.home.tool.name')}</span>
      </div>
      <div className="flex flex-col text-xl">
        <span>{t('dashboard.home.tool.designedFor')}</span>
        <span>{t('dashboard.home.tool.focus')}</span>
      </div>
    </div>
  );
}
