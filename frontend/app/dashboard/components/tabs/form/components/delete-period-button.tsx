import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons/icons';
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  useDeleteReportingPeriodMutation,
  useGetReportingPeriodsByOrganizationQuery,
} from '@/redux/api/reporting-periods/reportingPeriodsApiSlice';
import { useAppDispatch } from '@/redux/store';
import {
 SharedUIActions,  useSelectedOrganizationId,
  useSelectedReportingPeriodId } from '@/redux/store/ui/shared';

interface DeletePeriodButtonProps {
  reportingPeriodId: number;
}

export function DeletePeriodButton({
  reportingPeriodId,
}: DeletePeriodButtonProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [deletePeriod] = useDeleteReportingPeriodMutation();

  const selectedOrganizationId = useSelectedOrganizationId('form');
  const selectedResultsReportingPeriodId =
    useSelectedReportingPeriodId('results');

  const reportingPeriods = useGetReportingPeriodsByOrganizationQuery(
    selectedOrganizationId ?? 0,
    { skip: selectedOrganizationId === undefined },
  );

  async function handleDeleteReportingPeriod() {
    const result = await deletePeriod(reportingPeriodId);
    if (!('error' in result) && result.data) {
      dispatch(
        SharedUIActions.setSelectedReportingPeriodId({
          selectedReportingPeriodId:
            reportingPeriods.currentData?.at(-1)?.id !== reportingPeriodId
              ? reportingPeriods.currentData?.at(-1)?.id
              : reportingPeriods.currentData?.at(-2)?.id,
          section: 'form',
        }),
      );
      if (selectedResultsReportingPeriodId === reportingPeriodId) {
        dispatch(
          SharedUIActions.setSelectedReportingPeriodId({
            selectedReportingPeriodId:
              reportingPeriods.currentData?.at(-1)?.id !== reportingPeriodId
                ? reportingPeriods.currentData?.at(-1)?.id
                : reportingPeriods.currentData?.at(-2)?.id,
            section: 'results',
          }),
        );
      }
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="light">
          <span className="flex items-center gap-1 px-4 font-bold">
            <Icons.Trash />
            {t('dashboard.form.deletePeriod')}
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverPortal>
        <PopoverContent
          align="start"
          side="bottom"
          sideOffset={2}
          className="h-fit rounded-[2px] border border-popover-menu-border bg-popover-menu p-0 shadow-sm"
        >
          <div className="flex flex-row flex-wrap items-center justify-between gap-y-3 p-5">
            <span className="w-full">
              {t('dashboard.form.deletePeriodWarning')}
            </span>
            <PopoverClose asChild>
              <Button
                variant="link"
                size="fit"
                className="font-bold text-popover-foreground hover:text-popover-foreground"
                type="button"
              >
                <span>{t('forms.cancel')}</span>
              </Button>
            </PopoverClose>
            <PopoverClose asChild>
              <Button
                onClick={() => {
                  handleDeleteReportingPeriod();
                }}
                className="h-9 p-0"
                type="button"
              >
                <span className="px-5 py-2 text-sm">
                  {t('dashboard.form.confirmDeletePeriod')}
                </span>
              </Button>
            </PopoverClose>
          </div>
        </PopoverContent>
      </PopoverPortal>
    </Popover>
  );
}
