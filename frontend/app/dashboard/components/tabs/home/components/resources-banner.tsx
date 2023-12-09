import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons/icons';

export function ResourcesBanner() {
  const { t } = useTranslation();

  return (
    <div className="mt-20 flex w-full flex-col gap-y-10 bg-gradient-to-b from-gray-200 to-transparent pb-20 pt-20">
      <div className="flex w-full flex-wrap items-start justify-around gap-x-5 gap-y-10 px-2  sm:px-8 lg:px-12">
        <div className="flex max-w-[300px] flex-col gap-6 text-black">
          <Button
            variant="icon"
            size="fit"
            className="text-black"
            type="button"
            asChild
          >
            <a
              target="_blank"
              href="https://www.google.com"
              // href={
              //   generalSettings.currentData?.data.attributes.userManualLink
              //     ?.url
              // }

              rel="noopener noreferrer"
            >
              <Icons.Flowsheet className="h-12 w-12" />
            </a>
          </Button>
          <span className="text-2xl font-extrabold">
            {t('dashboard.home.resources.inventory')}
          </span>
          <span className="mt-3 text-xl">
            {t('dashboard.home.resources.inventory.text')}
          </span>
        </div>
        <div className="flex max-w-[300px] flex-col gap-6 text-black">
          <Button
            variant="icon"
            size="fit"
            className="text-black"
            type="button"
            asChild
          >
            <a
              target="_blank"
              href="https://www.google.com"
              // href={
              //   generalSettings.currentData?.data.attributes.userManualLink
              //     ?.url
              // }

              rel="noopener noreferrer"
            >
              <Icons.Movie className="h-12 w-12" />
            </a>
          </Button>
          <span className="text-2xl font-extrabold">
            {t('dashboard.home.resources.video')}
          </span>
          <span className="mt-3 text-xl">
            {t('dashboard.home.resources.video.text')}
          </span>
          <Button
            variant="link"
            size="fit"
            className="mt-6 text-xl font-bold"
            type="button"
            asChild
          >
            <a
              target="_blank"
              href="https://www.google.com"
              // href={
              //   generalSettings.currentData?.data.attributes.userManualLink
              //     ?.url
              // }

              rel="noopener noreferrer"
            >
              {t('dashboard.home.resources.downloadTemplate')}
            </a>
          </Button>
        </div>
        <div className="flex max-w-[300px] flex-col gap-6 text-black">
          <Button
            variant="icon"
            size="fit"
            className="text-black"
            type="button"
            asChild
          >
            <a
              target="_blank"
              href="https://www.google.com"
              // href={
              //   generalSettings.currentData?.data.attributes.userManualLink
              //     ?.url
              // }

              rel="noopener noreferrer"
            >
              <Icons.FolderData className="h-12 w-12" />
            </a>
          </Button>
          <span className="text-2xl font-extrabold">
            {t('dashboard.home.resources.github')}
          </span>
          <span className="mt-3 text-xl">
            {t('dashboard.home.resources.github.text')}
          </span>
        </div>
      </div>
      <div className="sm:pr-12 lg:ml-auto">
        <Button
          variant="link"
          size="fit"
          className="flex w-full flex-1 items-center gap-x-5 text-4xl font-bold"
          type="button"
          asChild
        >
          <a
            target="_blank"
            href="https://www.google.com"
            // href={
            //   generalSettings.currentData?.data.attributes.userManualLink
            //     ?.url
            // }
            rel="noopener noreferrer"
          >
            <span className="text-black">
              {t('dashboard.home.resources.other')}
            </span>
            <Icons.ArrowOutward className="h-6 w-6" />
          </a>
        </Button>
      </div>
    </div>
  );
}
