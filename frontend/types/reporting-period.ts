import { z } from 'zod';

import { EmissionEntryWithOrganizationUnitAndEmissionSource } from './emission-entry';

export type ReportingPeriod = {
  id: number;
  attributes: {
    startDate: string;
    endDate: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
};

export type ReportingPeriodWithEmissionEntries = ReportingPeriod & {
  attributes: {
    emissionEntries: {
      data: EmissionEntryWithOrganizationUnitAndEmissionSource[];
    };
  };
};

export type CreateReportingPeriodData = {
  organization: number;
  name: string;
  startDate: string;
  endDate: string;
};

export const ReportingPeriodSchema = (
  availableYears: number[],
): z.ZodType<CreateReportingPeriodData> =>
  z
    .object({
      organization: z.number().int().positive({
        message: 'dashboard.form.reportingPeriod.organization.error.select',
      }),
      name: z
        .string()
        .min(3, {
          message: 'dashboard.form.reportingPeriod.name.error.minLength',
        })
        .max(100, {
          message: 'dashboard.form.reportingPeriod.name.error.maxLength',
        }),
      startDate: z
        .string()
        .refine((value) => !Number.isNaN(Date.parse(value)), {
          message: 'dashboard.form.reportingPeriod.startDate.error.valid',
        }),
      endDate: z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
        message: 'dashboard.form.reportingPeriod.endDate.error.valid',
      }),
    })
    .refine(
      (data) => {
        const startDate = Date.parse(data.startDate);
        const endDate = Date.parse(data.endDate);
        return startDate && endDate && endDate > startDate;
      },
      {
        message: 'dashboard.form.reportingPeriod.endDate.error.afterStartDate',
        path: ['startDate'],
      },
    )
    .refine(
      (data) => {
        const endDateYear = new Date(Date.parse(data.endDate)).getFullYear();
        const maxYear = Math.max(...availableYears);
        return endDateYear <= maxYear;
      },
      {
        message: 'dashboard.form.reportingPeriod.endDate.error.invalidYear',
        path: ['endDate'],
      },
    );
