import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import FormInput from '@/components/form/form-input';
import { Button } from '@/components/ui/button';
import { useCreateReportingPeriodMutation } from '@/redux/api/reporting-periods/reportingPeriodsApiSlice';
import { useAppDispatch } from '@/redux/store';
import { SharedUIActions } from '@/redux/store/ui/shared';
import { OrganizationAndReportingPeriodSection } from '@/redux/store/ui/shared/stateType';
import { ReportingPeriodSchema } from '@/types/reporting-period';

interface CreateReportingPeriodFormProps {
  setFormVisible: (visibility: boolean) => void;
  organizationId: number | undefined;
  section: OrganizationAndReportingPeriodSection;
}

export function CreateReportingPeriodForm({
  setFormVisible,
  organizationId,
  section,
}: CreateReportingPeriodFormProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [createReportingPeriod, createReportingPeriodState] =
    useCreateReportingPeriodMutation();
  const form = useForm<z.infer<typeof ReportingPeriodSchema>>({
    resolver: zodResolver(ReportingPeriodSchema),
  });

  async function onSubmit(data: z.infer<typeof ReportingPeriodSchema>) {
    const result = await createReportingPeriod(data);
    if (!('error' in result) && result.data) {
      dispatch(
        SharedUIActions.setSelectedReportingPeriodId({
          selectedReportingPeriodId: result.data.data.id,
          section,
        }),
      );
      setFormVisible(false);
    }
  }

  return (
    <div className="flex w-full flex-row flex-wrap gap-8">
      <div className="bg-background">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-row flex-wrap gap-8 p-8">
            <div className="flex basis-full flex-row flex-wrap justify-between gap-4">
              <div className="min-w-[230px]">
                <FormInput
                  id="name"
                  type="text"
                  label={t('dashboard.form.reportingPeriod.name')}
                  className="bg-primary-foreground"
                  {...form.register('name')}
                  errorMessage={
                    form.formState.errors.name?.message !== undefined
                      ? t(form.formState.errors.name.message)
                      : undefined
                  }
                />
              </div>
              <div className="min-w-[230px]">
                <FormInput
                  type="date"
                  id="startDate"
                  label={t('dashboard.form.reportingPeriod.startDate')}
                  className="bg-primary-foreground"
                  {...form.register('startDate')}
                  errorMessage={
                    form.formState.errors.startDate?.message !== undefined
                      ? t(form.formState.errors.startDate?.message)
                      : undefined
                  }
                />
              </div>
              <div className="min-w-[230px]">
                <FormInput
                  type="date"
                  id="endDate"
                  label={t('dashboard.form.reportingPeriod.endDate')}
                  className="bg-primary-foreground"
                  {...form.register('endDate')}
                  errorMessage={
                    form.formState.errors.endDate?.message !== undefined
                      ? t(form.formState.errors.endDate?.message)
                      : undefined
                  }
                />
              </div>
            </div>
            <FormInput
              type="hidden"
              id="organization"
              value={organizationId ?? -1}
              errorMessage={
                form.formState.errors.organization?.message !== undefined
                  ? t(form.formState.errors.organization?.message)
                  : undefined
              }
              {...form.register('organization', { valueAsNumber: true })}
            />
            <div className="flex basis-full flex-row flex-wrap items-center justify-start gap-8 gap-y-8 md:justify-end">
              {createReportingPeriodState.isError && (
                <span className="break-normal font-bold text-destructive">
                  {t('dashboard.form.reportingPeriod.errorWhileCreating')}
                </span>
              )}
              <Button
                variant="link"
                className="font-bold text-primary hover:text-primary active:text-primary"
                onClick={() => setFormVisible(false)}
              >
                <span>{t('forms.cancel')}</span>
              </Button>
              <Button
                type="submit"
                disabled={createReportingPeriodState.isLoading}
              >
                <span className="px-4 font-bold">{t('forms.save')}</span>
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
