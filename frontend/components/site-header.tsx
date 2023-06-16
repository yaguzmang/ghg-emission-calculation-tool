import Image from 'next/image';

import { HeaderLanguageSelector } from './header-language-selector';
import { UserNavInfo } from './user-nav-info';

import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons/icons';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full bg-primary drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
      <div className="ml-0 mr-0 flex h-10 items-center bg-primary-foreground">
        <div className="relative flex h-full w-44 items-center justify-center bg-taltech-green">
          <h4 className="font-extrabold text-primary-foreground">
            GHG Calculator
          </h4>
          <div className="absolute top-full">
            <Icons.NotchDown className="h-[7px] w-[16px] text-taltech-green" />
          </div>
        </div>
        <div className="mr-8 flex flex-1 items-center justify-end text-primary">
          <HeaderLanguageSelector />
          <Button variant="icon" size="fit" className="ml-6">
            <Icons.HelpCircleFilled />
          </Button>
        </div>
      </div>
      <div className="ml-0 mr-0 flex h-16 items-center">
        <div className="ml-8">
          <Image
            src="/logos/taltech.png"
            width={61}
            height={34}
            alt="TalTech logo"
          />
        </div>
        <div className="mr-8 flex flex-1 items-center justify-end text-secondary-foreground ">
          <div className="mr-12 border-l">
            <Icons.TallinnaTehnikaulikool className="h-[21px] w-[126px] pl-2" />
          </div>
          <UserNavInfo />
        </div>
      </div>
    </header>
  );
}
