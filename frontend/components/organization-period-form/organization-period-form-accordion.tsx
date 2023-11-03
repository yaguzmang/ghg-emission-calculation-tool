'use client';

import { useTranslation } from 'react-i18next';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@radix-ui/react-accordion';

import { OrganizationPeriodForm } from '@/components/organization-period-form/organization-period-form';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons/icons';
import { useGetReportingPeriodsByOrganizationQuery } from '@/redux/api/reporting-periods/reportingPeriodsApiSlice';
import { useGetUserQuery } from '@/redux/api/user/userApiSlice';
import {
  useSelectedOrganizationId,
  useSelectedReportingPeriodId,
} from '@/redux/store/ui/shared';
import { OrganizationAndReportingPeriodSection } from '@/redux/store/ui/shared/stateType';

interface OrganizationPeriodFormAccordionProps {
  section: OrganizationAndReportingPeriodSection;
}

export function OrganizationPeriodFormAccordion({
  section,
}: OrganizationPeriodFormAccordionProps) {
  const { t } = useTranslation();

  const selectedeportingPeriodId = useSelectedReportingPeriodId(section);
  const selectedOrganizationId = useSelectedOrganizationId(section);

  const userData = useGetUserQuery();
  const userOrgs = userData.currentData?.organizations ?? [];

  const reportingPeriods = useGetReportingPeriodsByOrganizationQuery(
    selectedOrganizationId ?? 0,
    { skip: selectedOrganizationId === undefined },
  );

  const selectedOrganizationData = userOrgs.find(
    ({ id }) => id === selectedOrganizationId,
  );
  const selectedReportingPeriodData = reportingPeriods.currentData?.find(
    ({ id }) => id === selectedeportingPeriodId,
  );

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full border-b border-gray-lighten"
    >
      <AccordionItem value="period-settings-form">
        <div className="flex w-full flex-col justify-between gap-x-4 pb-4 sm:px-2 md:px-4 lg:px-8">
          <h4 className="text-black">{selectedOrganizationData?.name}</h4>
          <div className="flex flex-wrap gap-x-2">
            <div className="flex grow flex-wrap gap-x-2 text-black">
              <h4>
                {selectedReportingPeriodData?.attributes.startDate.replaceAll(
                  '-',
                  '.',
                )}
              </h4>
              <h4>-</h4>
              <h4>
                {selectedReportingPeriodData?.attributes.endDate.replaceAll(
                  '-',
                  '.',
                )}
              </h4>
            </div>
            <div className="ml-auto flex gap-x-2 pl-4 pr-2 text-black sm:flex-col">
              <AccordionTrigger
                asChild
                className="transition-all hover:underline [&[data-state=open]>svg]:rotate-180"
              >
                <Button
                  type="button"
                  variant="icon"
                  size="fit"
                  className="text-black hover:text-black/90 active:text-black"
                >
                  <span className="pr-2">
                    {t('dashboard.form.periodSettings')}
                  </span>
                  <Icons.ArrowsDownSmall className="h-2 w-2" />
                </Button>
              </AccordionTrigger>
            </div>
          </div>
        </div>

        <AccordionContent className="overflow-hidden transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down sm:px-2 md:px-4 lg:px-8">
          <div className="pb-16 pt-8">
            <OrganizationPeriodForm section={section} />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
